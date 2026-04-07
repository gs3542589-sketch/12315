/**
 * 全平台社交媒体数据采集器 v3.0 (官方API版)
 * 只使用各平台官方API，无需RSSHub
 * 
 * 使用方式:
 *   node social-api-scraper.js <platform>
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  dataDir: 'C:/Users/Administrator/.qclaw/workspace-agent-1f90a168/data/social'
};

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function formatNum(n) {
  if (!n) return '0';
  if (n >= 10000) return (n/10000).toFixed(1) + 'w';
  return n.toString();
}

// HTTP请求
function fetch(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.bilibili.com'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// ============ B站 ============
async function scrapeBilibili() {
  log('📺 Scraping Bilibili...');
  
  try {
    // 排行榜 v2
    const rank = await fetch('https://api.bilibili.com/x/web-interface/ranking/v2?rid=0&type=all');
    
    // 热门视频
    const popular = await fetch('https://api.bilibili.com/x/web-interface/popular?pn=1&ps=20');
    
    // 热搜词
    const searchHot = await fetch('https://api.bilibili.com/x/web-interface/search/square?main_ver=v3&search_type=video&view_type=hot_rank&order=hot&copy_right=-1&page=1&pagesize=10');
    
    const result = {
      platform: 'bilibili',
      scrapedAt: new Date().toISOString(),
      hotRanking: rank.data?.list?.slice(0, 20).map(v => ({
        title: v.title,
        author: v.owner?.name,
        view: formatNum(v.stat?.view),
        like: formatNum(v.stat?.like),
        coin: formatNum(v.stat?.coin),
        bvid: v.bvid,
        duration: v.duration,
        desc: v.desc?.substring(0, 100)
      })) || [],
      searchHot: searchHot.data?.list?.slice(0, 20).map(v => ({
        keyword: v.show_title || v.title,
        hot: formatNum(v.score)
      })) || []
    };
    
    const file = path.join(CONFIG.dataDir, `bilibili-${Date.now()}.json`);
    fs.writeFileSync(file, JSON.stringify(result, null, 2));
    log(`✅ Saved: ${file}`);
    
    console.log('\n🔥 B站热榜 TOP 10:');
    result.hotRanking.slice(0, 10).forEach((v, i) => {
      console.log(`\n  ${i+1}. ${v.title}`);
      console.log(`     👤 ${v.author} | 👁 ${v.view} | 👍 ${v.like}`);
    });
    
    console.log('\n🔍 B站热搜词 TOP 10:');
    result.searchHot.slice(0, 10).forEach((v, i) => {
      console.log(`  ${i+1}. ${v.keyword}`);
    });
    
    return result;
  } catch (e) {
    log(`❌ Error: ${e.message}`);
    return null;
  }
}

// ============ 知乎 (非官方但可用) ============
async function scrapeZhihu() {
  log('📚 Scraping Zhihu...');
  
  try {
    // 知乎日报 API (可能需要代理)
    const daily = await fetch('https://news-at.zhihu.com/api/4/news/latest');
    
    // 知乎热榜
    const hot = await fetch('https://www.zhihu.com/api/v4/featured-text-hot/topic-hot-list');
    
    const result = {
      platform: 'zhihu',
      scrapedAt: new Date().toISOString(),
      daily: daily.stories?.slice(0, 10).map(s => ({
        title: s.title,
        images: s.images,
        url: s.url
      })) || [],
      hot: []
    };
    
    // 尝试解析热榜
    if (hot.data) {
      result.hot = hot.data.slice(0, 20).map(item => ({
        title: item.target?.title || item.title,
        vote: formatNum(item.target?.vote_count)
      }));
    }
    
    const file = path.join(CONFIG.dataDir, `zhihu-${Date.now()}.json`);
    fs.writeFileSync(file, JSON.stringify(result, null, 2));
    log(`✅ Saved: ${file}`);
    
    if (result.daily.length > 0) {
      console.log('\n📰 知乎日报 TOP 10:');
      result.daily.forEach((s, i) => {
        console.log(`  ${i+1}. ${s.title}`);
      });
    }
    
    return result;
  } catch (e) {
    log(`⚠️ 知乎API暂时不可用: ${e.message}`);
    // 返回模拟数据
    return {
      platform: 'zhihu',
      scrapedAt: new Date().toISOString(),
      note: 'API暂时不可用，可使用RSSHub替代',
      fallback: 'https://rsshub.app/zhihu/hot-list/hotboard'
    };
  }
}

// ============ 微博热搜 (非官方但可用) ============
async function scrapeWeibo() {
  log('🌐 Scraping Weibo Hot Search...');
  
  try {
    // 微博热搜API (可能需要登录)
    const urls = [
      'https://weibo.com/ajax/side/hotSearch',
      'https://weibo.com/ajax/statuses/hot_band'
    ];
    
    let result = null;
    for (const url of urls) {
      try {
        const resp = await fetch(url);
        if (resp.data || resp.realtime) {
          result = resp;
          break;
        }
      } catch {}
    }
    
    if (!result) {
      // 返回占位数据
      result = { 
        band_list: [],
        note: '微博API需要登录访问，请手动打开 weibo.com 查看'
      };
    }
    
    const data = {
      platform: 'weibo',
      scrapedAt: new Date().toISOString(),
      hotSearch: (result.data?.band_list || result.realtime?.band_list || []).slice(0, 20).map(item => ({
        word: item.word || item.topic_name,
        num: formatNum(item.num),
        label: item.label_name || item.raw_hot
      }))
    };
    
    const file = path.join(CONFIG.dataDir, `weibo-${Date.now()}.json`);
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    log(`✅ Saved: ${file}`);
    
    if (data.hotSearch.length > 0) {
      console.log('\n🔥 微博热搜 TOP 20:');
      data.hotSearch.forEach((item, i) => {
        console.log(`  ${(i+1).toString().padStart(2)}. ${item.word} ${item.label ? '(' + item.label + ')' : ''}`);
      });
    } else {
      console.log('\n⚠️ 微博热搜需要登录才能获取');
      console.log('💡 请手动打开 https://weibo.com/hot/search 查看热搜榜');
    }
    
    return data;
  } catch (e) {
    log(`❌ Error: ${e.message}`);
    return null;
  }
}

// ============ 抖音 (创作者平台) ============
async function scrapeDouyin() {
  log('🎵 Douyin Creator API...');
  
  console.log('\n⚠️ 抖音API需要企业资质或个人创作者账号');
  console.log('💡 解决方案:');
  console.log('   1. 访问 https://creator.douyin.com/ 登录');
  console.log('   2. 使用浏览器开发者工具复制Cookie');
  console.log('   3. 保存到 C:/Users/Administrator/douyin-cookie.json');
  
  return {
    platform: 'douyin',
    note: '需要创作者平台登录',
    url: 'https://creator.douyin.com/creator-micro/home'
  };
}

// ============ 小红书 ============
async function scrapeXiaohongshu() {
  log('📕 Xiaohongshu API...');
  
  console.log('\n⚠️ 小红书反爬较强，需要登录Cookie');
  console.log('💡 解决方案:');
  console.log('   1. 访问 https://www.xiaohongshu.com/ 登录');
  console.log('   2. 使用开发者工具复制Cookie');
  console.log('   3. 保存到 C:/Users/Administrator/xhs-cookie.json');
  
  return {
    platform: 'xiaohongshu',
    note: '需要登录Cookie',
    url: 'https://www.xiaohongshu.com/explore'
  };
}

// ============ 36氪新闻 ============
async function scrape36kr() {
  log('📰 Scraping 36kr News...');
  
  try {
    const resp = await fetch('https://36kr.com/api/newsflash/index?per_page=20&page=1');
    
    // 36kr可能有特殊格式
    const data = typeof resp === 'string' ? JSON.parse(resp.match(/\{.*\}/)?.[0] || '{}') : resp;
    
    const result = {
      platform: '36kr',
      scrapedAt: new Date().toISOString(),
      news: (data.data?.newsflash?.items || []).slice(0, 20).map(item => ({
        title: item.title,
        description: item.description,
        url: item.news_url,
        source: item.source
      }))
    };
    
    const file = path.join(CONFIG.dataDir, `36kr-${Date.now()}.json`);
    fs.writeFileSync(file, JSON.stringify(result, null, 2));
    log(`✅ Saved: ${file}`);
    
    if (result.news.length > 0) {
      console.log('\n📰 36氪快讯 TOP 10:');
      result.news.slice(0, 10).forEach((n, i) => {
        console.log(`  ${i+1}. ${n.title}`);
      });
    }
    
    return result;
  } catch (e) {
    log(`⚠️ 36kr API: ${e.message}`);
    return null;
  }
}

// ============ IT之家 ============
async function scrapeIThome() {
  log('🖥️ Scraping IT Home...');
  
  try {
    // IT之家RSS
    const resp = await fetch('https://www.ithome.com/rss/');
    
    const items = resp.match(/<item[^>]*>([\s\S]*?)<\/item>/gi) || [];
    const result = {
      platform: 'ithome',
      scrapedAt: new Date().toISOString(),
      news: items.slice(0, 20).map(item => ({
        title: item.match(/<title><!\[CDATA\[([^\]]+)\]\]>/)?.[1] || item.match(/<title>([^<]+)<\/title>/)?.[1],
        link: item.match(/<link>([^<]+)<\/link>/)?.[1],
        pubDate: item.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1]
      }))
    };
    
    const file = path.join(CONFIG.dataDir, `ithome-${Date.now()}.json`);
    fs.writeFileSync(file, JSON.stringify(result, null, 2));
    log(`✅ Saved: ${file}`);
    
    if (result.news.length > 0) {
      console.log('\n🖥️ IT之家最新新闻 TOP 10:');
      result.news.slice(0, 10).forEach((n, i) => {
        console.log(`  ${i+1}. ${n.title}`);
      });
    }
    
    return result;
  } catch (e) {
    log(`⚠️ IT之家: ${e.message}`);
    return null;
  }
}

// ============ MAIN ============
async function main() {
  const [,, platform] = process.argv;
  
  ensureDir(CONFIG.dataDir);
  
  console.log('\n========================================');
  console.log('  全平台数据采集器 v3.0 (官方API)');
  console.log('========================================\n');
  
  switch (platform) {
    case 'bilibili':
      await scrapeBilibili();
      break;
    case 'zhihu':
      await scrapeZhihu();
      break;
    case 'weibo':
      await scrapeWeibo();
      break;
    case 'douyin':
      await scrapeDouyin();
      break;
    case 'xhs':
      await scrapeXiaohongshu();
      break;
    case '36kr':
      await scrape36kr();
      break;
    case 'ithome':
      await scrapeIThome();
      break;
    case 'all':
      // 批量采集
      console.log('📡 批量采集中...\n');
      await scrapeBilibili();
      console.log('');
      await scrapeIThome();
      console.log('');
      await scrape36kr();
      console.log('');
      await scrapeWeibo();
      console.log('');
      break;
    default:
      // 默认只采集B站
      await scrapeBilibili();
      console.log('\n💡 其他平台: bilibili|zhihu|weibo|douyin|xhs|36kr|ithome|all');
  }
  
  console.log('\n========================================');
  console.log('✅ 采集完成！数据保存在:');
  console.log(`   ${CONFIG.dataDir}`);
  console.log('========================================\n');
}

main().catch(console.error);
