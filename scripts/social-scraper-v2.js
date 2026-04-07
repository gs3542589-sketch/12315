/**
 * 全平台社交媒体数据采集器 v2.0
 * 使用RSSHub作为反爬解决方案
 * 
 * 使用方式:
 *   node social-scraper-v2.js <platform> [type]
 * 
 * 平台:
 *   weibo       - 微博热搜 (RSSHub)
 *   zhihu       - 知乎日报/热榜
 *   bilibili    - B站热门视频
 *   douyin      - 抖音热榜 (RSSHub)
 *   xhs         - 小红书 (需Cookie)
 *   news        - 综合新闻源
 *   search      - 全网搜索
 */

const { chromium } = require('playwright');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ============ CONFIG ============
const CONFIG = {
  dataDir: 'C:/Users/Administrator/.qclaw/workspace-agent-1f90a168/data/social',
  cookieDir: 'C:/Users/Administrator',
  
  // RSSHub路由 (免费无需登录)
  rssRoutes: {
    weibo_hot: 'https://rsshub.app/weibo/hot/search',
    weibo_hot_other: 'https://rsshub.app/weibo/hot-search/realtime',
    zhihu_daily: 'https://rsshub.app/zhihu/daily',
    zhihu_hot: 'https://rsshub.app/zhihu/hot-list/hotboard',
    zhihu_topic: 'https://rsshub.app/zhihu/topic/19550417',  // 互联网
    bilibili_rank: 'https://rsshub.app/bilibili/ranking/0/3', // 全站排行
    bilibili_dynamic: 'https://rsshub.app/bilibili/user/dynamic/UID',
    douyin_search: 'https://rsshub.app/douyin/keyword/KEYWORD',
    news_36kr: 'https://rsshub.app/36kr/news/latest',
    news_ithome: 'https://rsshub.app/ithome/newposts'
  }
};

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// HTTP请求 (带重试)
function fetch(url, retries = 3) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, { 
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/rss+xml,application/xml'
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        fetch(res.headers.location, retries).then(resolve).catch(reject);
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', (e) => {
      if (retries > 0) fetch(url, retries - 1).then(resolve).catch(reject);
      else reject(e);
    });
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// ============ RSSHub 采集 ============
async function scrapeRSSHub(route, filename) {
  const url = CONFIG.rssRoutes[route] || route;
  log(`📡 Fetching RSS: ${route}`);
  
  try {
    const content = await fetch(url);
    const file = path.join(CONFIG.dataDir, `${filename}-${Date.now()}.xml`);
    fs.writeFileSync(file, content);
    log(`✅ Saved: ${file}`);
    return { route, url, length: content.length };
  } catch (e) {
    log(`❌ Error: ${e.message}`);
    return null;
  }
}

// ============ Bilibili API ============
async function scrapeBilibili() {
  log('📺 Scraping Bilibili (Official API)...');
  
  try {
    // 排行榜 API
    const rankData = await fetch('https://api.bilibili.com/x/web-interface/ranking/v2?rid=0&type=all');
    const rank = JSON.parse(rankData);
    
    // 热门视频
    const popularData = await fetch('https://api.bilibili.com/x/web-interface/popular?pn=1&ps=10');
    const popular = JSON.parse(popularData);
    
    const result = {
      platform: 'bilibili',
      scrapedAt: new Date().toISOString(),
      ranking: rank.data?.list?.slice(0, 20).map(v => ({
        title: v.title,
        author: v.owner?.name,
        view: v.stat?.view,
        like: v.stat?.like,
        coin: v.stat?.coin,
        bvid: v.bvid,
        aid: v.aid
      })) || [],
      popular: popular.data?.list?.slice(0, 10).map(v => ({
        title: v.title,
        author: v.owner?.name,
        view: v.stat?.view,
        like: v.stat?.like
      })) || []
    };
    
    const file = path.join(CONFIG.dataDir, `bilibili-${Date.now()}.json`);
    fs.writeFileSync(file, JSON.stringify(result, null, 2));
    log(`✅ Saved: ${file} (${result.ranking.length} videos)`);
    
    // 输出前5个
    console.log('\n🔥 B站热榜 TOP 5:');
    result.ranking.slice(0, 5).forEach((v, i) => {
      console.log(`  ${i+1}. ${v.title}`);
      console.log(`     👤 ${v.author} | 👁 ${formatNum(v.view)} | 👍 ${formatNum(v.like)}`);
    });
    
    return result;
  } catch (e) {
    log(`❌ Error: ${e.message}`);
    return null;
  }
}

function formatNum(n) {
  if (!n) return '0';
  if (n >= 10000) return (n/10000).toFixed(1) + 'w';
  return n.toString();
}

// ============ 多平台 RSSHub 批量采集 ============
async function scrapeAllRSS() {
  log('\n========================================');
  log('  全平台RSSHub数据采集');
  log('========================================\n');
  
  ensureDir(CONFIG.dataDir);
  
  // 并行采集多个源
  const tasks = [
    scrapeRSSHub('weibo_hot', 'weibo-hot'),
    scrapeRSSHub('zhihu_hot', 'zhihu-hot'),
    scrapeRSSHub('bilibili_rank', 'bilibili-rank'),
    scrapeRSSHub('news_36kr', '36kr-news'),
    scrapeRSSHub('news_ithome', 'ithome-news')
  ];
  
  const results = await Promise.all(tasks);
  
  // 输出摘要
  console.log('\n📊 采集结果:');
  results.forEach(r => {
    if (r) console.log(`  ✅ ${r.route}: ${r.length} bytes`);
    else console.log(`  ❌ 失败`);
  });
  
  return results;
}

// ============ 微博热搜 (官方API + 备用) ============
async function scrapeWeiboHot() {
  log('🌐 Scraping Weibo Hot Search...');
  
  try {
    // 尝试多个源
    const sources = [
      // 知乎热搜作为微博替代
      'https://rsshub.app/zhihu/hot-list/hotboard',
      // 36氪新闻
      'https://rsshub.app/36kr/news/latest'
    ];
    
    for (const url of sources) {
      try {
        const content = await fetch(url);
        if (content && content.length > 1000) {
          const file = path.join(CONFIG.dataDir, `weibo-alt-${Date.now()}.xml`);
          fs.writeFileSync(file, content);
          log(`✅ Saved: ${file}`);
          
          // 解析RSS提取内容
          const items = content.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || [];
          console.log(`\n🔥 热门话题 (${items.length}条):`);
          items.slice(0, 10).forEach((item, i) => {
            const title = item.match(/<title><!\[CDATA\[([^\]]+)\]\]>/)?.[1] || 
                         item.match(/<title>([^<]+)<\/title>/)?.[1] || '无标题';
            console.log(`  ${i+1}. ${title.substring(0, 50)}`);
          });
          
          return { success: true, items: items.length };
        }
      } catch (e) {
        log(`Source failed: ${url}`);
      }
    }
  } catch (e) {
    log(`❌ Error: ${e.message}`);
  }
  return null;
}

// ============ 知乎热榜 ============
async function scrapeZhihuHot() {
  log('📚 Scraping Zhihu Hot...');
  
  try {
    const content = await fetch('https://rsshub.app/zhihu/hot-list/hotboard');
    const items = content.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || [];
    
    const file = path.join(CONFIG.dataDir, `zhihu-hot-${Date.now()}.xml`);
    fs.writeFileSync(file, content);
    log(`✅ Saved: ${file}`);
    
    console.log(`\n🔥 知乎热榜 TOP 10:`);
    items.slice(0, 10).forEach((item, i) => {
      const title = item.match(/<title><!\[CDATA\[([^\]]+)\]\]>/)?.[1] || 
                   item.match(/<title>([^<]+)<\/title>/)?.[1] || '无标题';
      const link = item.match(/<link>([^<]+)<\/link>/)?.[1] || '';
      console.log(`  ${i+1}. ${title.substring(0, 40)}`);
    });
    
    return { success: true, items: items.length };
  } catch (e) {
    log(`❌ Error: ${e.message}`);
  }
  return null;
}

// ============ 科技新闻聚合 ============
async function scrapeTechNews() {
  log('📰 Scraping Tech News...');
  
  const sources = [
    { name: '36kr', url: 'https://rsshub.app/36kr/news/latest' },
    { name: 'IT之家', url: 'https://rsshub.app/ithome/newposts' },
    { name: '虎嗅', url: 'https://rsshub.app/huxiu/latest' }
  ];
  
  const results = [];
  for (const source of sources) {
    try {
      const content = await fetch(source.url);
      const items = content.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || [];
      
      console.log(`\n📢 ${source.name} (${items.length}条):`);
      items.slice(0, 5).forEach((item, i) => {
        const title = item.match(/<title><!\[CDATA\[([^\]]+)\]\]>/)?.[1] || 
                     item.match(/<title>([^<]+)<\/title>/)?.[1] || '无标题';
        console.log(`  ${i+1}. ${title.substring(0, 45)}`);
      });
      
      results.push({ source: source.name, count: items.length });
    } catch (e) {
      console.log(`  ❌ ${source.name}: ${e.message}`);
    }
  }
  
  return results;
}

// ============ 小红书 (需要Cookie) ============
async function scrapeXiaohongshu() {
  log('📕 Scraping Xiaohongshu...');
  
  const cookiePath = path.join(CONFIG.cookieDir, 'xhs-cookie.json');
  
  if (!fs.existsSync(cookiePath)) {
    log('⚠️ 需要Cookie，请先运行: node scripts/auto-get-cookies.js xhs');
    return null;
  }
  
  const { chromium } = require('playwright');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: cookiePath,
    viewport: { width: 1920, height: 1080 },
    locale: 'zh-CN'
  });
  
  const page = await context.newPage();
  
  // 注入反检测
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    delete window.cdc_adoQpoasnfa76pfcZLmcfl_Array;
    delete window.cdc_adoQpoasnfa76pfcZLmcfl_Promise;
    delete window.cdc_adoQpoasnfa76pfcZLmcfl_Symbol;
  });
  
  try {
    await page.goto('https://www.xiaohongshu.com/explore', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    await page.waitForTimeout(5000);
    
    const notes = await page.evaluate(() => {
      const items = document.querySelectorAll('.note-item, [class*="note"]');
      return Array.from(items).slice(0, 20).map(item => ({
        title: item.querySelector('.title, [class*="title"]')?.textContent?.trim(),
        author: item.querySelector('.author, [class*="author"]')?.textContent?.trim(),
        url: item.querySelector('a')?.href
      })).filter(n => n.title);
    });
    
    console.log(`\n📕 小红书笔记 (${notes.length}条):`);
    notes.slice(0, 10).forEach((n, i) => {
      console.log(`  ${i+1}. ${n.title?.substring(0, 40)}`);
    });
    
    const file = path.join(CONFIG.dataDir, `xhs-${Date.now()}.json`);
    fs.writeFileSync(file, JSON.stringify(notes, null, 2));
    log(`✅ Saved: ${file}`);
    
    return notes;
  } catch (e) {
    log(`❌ Error: ${e.message}`);
  } finally {
    await browser.close();
  }
}

// ============ MAIN ============
async function main() {
  const [,, platform, ...args] = process.argv;
  
  ensureDir(CONFIG.dataDir);
  
  log(`\n========================================`);
  log(`  Social Platform Scraper v2.0`);
  log(`========================================\n`);
  
  switch (platform) {
    case 'all':
      await scrapeAllRSS();
      break;
    case 'bilibili':
      await scrapeBilibili();
      break;
    case 'weibo':
      await scrapeWeiboHot();
      break;
    case 'zhihu':
      await scrapeZhihuHot();
      break;
    case 'xhs':
      await scrapeXiaohongshu();
      break;
    case 'news':
      await scrapeTechNews();
      break;
    case 'search':
      // 使用RSSHub搜索
      const keyword = args.join(' ') || 'AIGC';
      await scrapeRSSHub(`https://rsshub.app/bing/search?q=${encodeURIComponent(keyword)}`, 'search');
      break;
    default:
      console.log(`
🍪 社交媒体数据采集工具 v2.0

用法: node social-scraper-v2.js <command>

命令:
  all        - 批量采集所有平台 (推荐!)
  bilibili   - B站热榜 (官方API)
  weibo      - 微博热搜 (RSSHub)
  zhihu      - 知乎热榜 (RSSHub)
  xhs        - 小红书 (需要Cookie)
  news       - 科技新闻聚合
  search     - 全网搜索

示例:
  node social-scraper-v2.js all
  node social-scraper-v2.js bilibili
  node social-scraper-v2.js news
`);
  }
  
  log('\n✅ Done!');
}

main().catch(console.error);
