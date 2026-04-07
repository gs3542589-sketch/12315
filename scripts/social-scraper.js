/**
 * 全平台社交媒体数据采集器 v1.0
 * 支持: 抖音, 小红书, 微博, B站, 知乎, 百度
 * 
 * 使用方式:
 *   node social-scraper.js bilibili <bvid>
 *   node social-scraper.js weibo <hot|user|comment> [id]
 *   node social-scraper.js zhihu <daily|topic|user> [id]
 *   node social-scraper.js douyin <creator|search> [keyword]
 *   node social-scraper.js xhs <note|user> [id]
 *   node social-scraper.js baidu <search> [keyword]
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// ============ CONFIG ============
const CONFIG = {
  dataDir: 'C:/Users/Administrator/.qclaw/workspace-agent-1f90a168/data/social',
  // 各平台Cookie路径
  cookies: {
    douyin: 'C:/Users/Administrator/douyin-cookie.json',
    xhs: 'C:/Users/Administrator/xhs-cookie.json',
    weibo: 'C:/Users/Administrator/weibo-cookie.json',
    bilibili: 'C:/Users/Administrator/bilibili-cookie.json',
    zhihu: 'C:/Users/Administrator/zhihu-cookie.json'
  },
  // 反检测设置
  stealth: {
    minDelay: 2000,
    maxDelay: 5000,
    userAgents: [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
    ]
  }
};

// ============ UTILS ============
function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function randomDelay() {
  const ms = CONFIG.stealth.minDelay + Math.random() * (CONFIG.stealth.maxDelay - CONFIG.stealth.minDelay);
  return new Promise(r => setTimeout(r, ms));
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ============ STEALTH BROWSER ============
async function createBrowser(cookiePath = null) {
  log('🔒 Creating stealth browser...');
  
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox', '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--exclude-switches=enable-automation',
      '--disable-infobars', '--no-first-run',
      '--disable-gpu', '--window-size=1920,1080'
    ]
  });
  
  const contextOptions = {
    viewport: { width: 1920, height: 1080 },
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai'
  };
  
  if (cookiePath && fs.existsSync(cookiePath)) {
    contextOptions.storageState = cookiePath;
  }
  
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  
  // Inject stealth script
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    window.navigator.chrome = { runtime: {} };
  });
  
  return { browser, context, page };
}

// ============ BILIBILI (官方API) ============
async function scrapeBilibili(bvid) {
  log('📺 Scraping Bilibili...');
  
  try {
    // 视频信息API (无需登录)
    const videoInfo = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`)
      .then(r => r.json());
    
    // 视频统计API
    const videoStat = await fetch(`https://api.bilibili.com/x/player/pagelist?bvid=${bvid}`)
      .then(r => r.json());
    
    // 推荐视频API
    const recommend = await fetch(`https://api.bilibili.com/x/web-interface/popular?pn=1&ps=10`)
      .then(r => r.json());
    
    const result = {
      platform: 'bilibili',
      scrapedAt: new Date().toISOString(),
      video: videoInfo.data,
      stat: videoStat.data,
      recommend: recommend.data?.list || []
    };
    
    const file = path.join(CONFIG.dataDir, `bilibili-${Date.now()}.json`);
    fs.writeFileSync(file, JSON.stringify(result, null, 2));
    log(`✅ Saved: ${file}`);
    return result;
  } catch (e) {
    log(`❌ Error: ${e.message}`);
    return null;
  }
}

// ============ 微博 (热搜榜) ============
async function scrapeWeibo(type = 'hot') {
  log(`🌐 Scraping Weibo (${type})...`);
  
  const { browser, context, page } = await createBrowser(CONFIG.cookies.weibo);
  
  try {
    let data = {};
    
    if (type === 'hot') {
      // 热搜榜
      await page.goto('https://weibo.com/ajax/statuses/hot_band', { 
        waitUntil: 'domcontentloaded', timeout: 15000 
      });
      await page.waitForTimeout(2000);
      
      const content = await page.content();
      const jsonMatch = content.match(/\{".*\}/);
      if (jsonMatch) {
        data.hot = JSON.parse(jsonMatch[0]);
      }
    }
    
    const file = path.join(CONFIG.dataDir, `weibo-${type}-${Date.now()}.json`);
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    log(`✅ Saved: ${file}`);
    return data;
    
  } finally {
    await browser.close();
  }
}

// ============ 知乎 (RSS方式) ============
async function scrapeZhihu(type = 'daily') {
  log(`📚 Scraping Zhihu (${type})...`);
  
  // 使用rsshub.app的免费路由
  const routes = {
    daily: 'https://rsshub.app/zhihu/daily',
    hot: 'https://rsshub.app/zhihu/hot-list/hotboard',
    tech: 'https://rsshub.app/zhihu/topic/19550417'
  };
  
  const url = routes[type] || routes.daily;
  
  try {
    const { browser, page } = await createBrowser();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(3000);
    
    const content = await page.content();
    const file = path.join(CONFIG.dataDir, `zhihu-${type}-${Date.now()}.json`);
    fs.writeFileSync(file, content);
    log(`✅ Saved: ${file}`);
    
    await browser.close();
    return { url, content: content.substring(0, 500) };
  } catch (e) {
    log(`❌ Error: ${e.message}`);
    return null;
  }
}

// ============ 抖音 (创作者平台) ============
async function scrapeDouyin(type = 'creator') {
  log(`🎵 Scraping Douyin (${type})...`);
  
  if (type === 'creator') {
    // 需要OAuth，这里提示用户
    log('⚠️ Douyin Creator API requires OAuth. Please:');
    log('   1. Visit https://creator.douyin.com/');
    log('   2. Login with your account');
    log('   3. Export cookie to: ' + CONFIG.cookies.douyin);
    return null;
  }
  
  const { browser, page } = await createBrowser(CONFIG.cookies.douyin);
  
  try {
    // 尝试访问创作者后台
    await page.goto('https://creator.douyin.com/creator-micro/home', {
      waitUntil: 'networkidle', timeout: 20000
    });
    
    const content = await page.content();
    const file = path.join(CONFIG.dataDir, `douyin-${Date.now()}.json`);
    fs.writeFileSync(file, content.substring(0, 5000));
    log(`✅ Saved: ${file}`);
    
    return { success: true };
  } catch (e) {
    log(`❌ Error: ${e.message}`);
    return null;
  } finally {
    await browser.close();
  }
}

// ============ 小红书 (已有脚本) ============
async function scrapeXHS(type = 'note') {
  log(`📕 Scraping Xiaohongshu (${type})...`);
  
  const { browser, page } = await createBrowser(CONFIG.cookies.xhs);
  
  try {
    if (type === 'note') {
      // 首页推荐
      await page.goto('https://www.xiaohongshu.com/explore', {
        waitUntil: 'networkidle', timeout: 20000
      });
      await randomDelay();
      
      const notes = await page.evaluate(() => {
        const items = document.querySelectorAll('.note-item');
        return Array.from(items).slice(0, 20).map(item => ({
          title: item.querySelector('.title')?.textContent?.trim(),
          author: item.querySelector('.author')?.textContent?.trim(),
          likes: item.querySelector('.like-count')?.textContent?.trim(),
          url: item.querySelector('a')?.href
        }));
      });
      
      const file = path.join(CONFIG.dataDir, `xhs-notes-${Date.now()}.json`);
      fs.writeFileSync(file, JSON.stringify(notes, null, 2));
      log(`✅ Saved: ${file} (${notes.length} notes)`);
      return notes;
    }
  } catch (e) {
    log(`❌ Error: ${e.message}`);
  } finally {
    await browser.close();
  }
}

// ============ 百度 (搜索) ============
async function scrapeBaidu(keyword) {
  log(`🔍 Scraping Baidu (${keyword})...`);
  
  const { browser, page } = await createBrowser();
  
  try {
    await page.goto(`https://www.baidu.com/s?wd=${encodeURIComponent(keyword)}`, {
      waitUntil: 'domcontentloaded', timeout: 15000
    });
    await page.waitForTimeout(2000);
    
    const results = await page.evaluate(() => {
      const items = document.querySelectorAll('.result, .result c-container');
      return Array.from(items).slice(0, 10).map(item => ({
        title: item.querySelector('h3')?.textContent?.trim(),
        url: item.querySelector('a')?.href,
        snippet: item.querySelector('.c-abstract, .content-right_8Zs40')?.textContent?.trim()
      }));
    });
    
    const file = path.join(CONFIG.dataDir, `baidu-${encodeURIComponent(keyword)}-${Date.now()}.json`);
    fs.writeFileSync(file, JSON.stringify(results, null, 2));
    log(`✅ Saved: ${file} (${results.length} results)`);
    return results;
    
  } catch (e) {
    log(`❌ Error: ${e.message}`);
  } finally {
    await browser.close();
  }
}

// ============ MAIN ============
async function main() {
  const [,, platform, type, ...args] = process.argv;
  
  ensureDir(CONFIG.dataDir);
  
  log(`========================================`);
  log(`  Social Platform Scraper v1.0`);
  log(`  Platform: ${platform || '?'} | Type: ${type || '?'}`);
  log(`========================================`);
  
  switch (platform) {
    case 'bilibili':
      await scrapeBilibili(type || 'BV1xx411c7XZ');
      break;
    case 'weibo':
      await scrapeWeibo(type || 'hot');
      break;
    case 'zhihu':
      await scrapeZhihu(type || 'daily');
      break;
    case 'douyin':
      await scrapeDouyin(type || 'creator');
      break;
    case 'xhs':
      await scrapeXHS(type || 'note');
      break;
    case 'baidu':
      await scrapeBaidu(args.join(' ') || '测试');
      break;
    default:
      console.log(`
Usage: node social-scraper.js <platform> [type] [args]

Platforms:
  bilibili <bvid>          - B站视频信息
  weibo <hot|user|comment> - 微博热搜/用户/评论
  zhihu <daily|hot|tech>   - 知乎日报/热榜/科技
  douyin <creator|search>   - 抖音创作者/搜索
  xhs <note|user>           - 小红书笔记/用户
  baidu <keyword>           - 百度搜索

Examples:
  node social-scraper.js bilibili BV1xx411c7XZ
  node social-scraper.js weibo hot
  node social-scraper.js baidu AI人工智能
`);
  }
  
  log('✅ Done!');
}

main().catch(console.error);
