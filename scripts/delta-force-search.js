/**
 * 三角洲行动 数据采集 v2
 * 使用正确的B站搜索API
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  dataDir: 'C:/Users/Administrator/.qclaw/workspace-agent-1f90a168/data/games'
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.bilibili.com'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(data); }
      });
    }).on('error', reject);
  });
}

function formatNum(n) {
  if (!n) return '0';
  n = Number(n);
  if (n >= 10000) return (n/10000).toFixed(1) + 'w';
  return n.toLocaleString();
}

// ============ B站搜索 (正确API) ============
async function searchBilibili(keyword) {
  console.log('\n========================================');
  console.log(`  📺 B站 "${keyword}" 搜索`);
  console.log('========================================\n');
  
  try {
    // 使用B站官方搜索API
    const url = `https://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword=${encodeURIComponent(keyword)}&page=1&page_size=30&order=totalrank`;
    const resp = await fetch(url);
    
    console.log('API响应码:', resp.code);
    console.log('结果数:', resp.data?.numResults || 0);
    
    const videos = resp.data?.result || [];
    
    if (videos.length > 0) {
      console.log(`\n✅ 找到 ${videos.length} 个视频:\n`);
      
      videos.slice(0, 20).forEach((v, i) => {
        const title = v.title?.replace(/<[^>]+>/g, '') || v.author || '无标题';
        console.log(`${(i+1).toString().padStart(2)}. ${title}`);
        console.log(`    👤 ${v.author} | 👁 ${formatNum(v.play)} | 👍 ${formatNum(v.favorite)} | 🪙 ${formatNum(v.coin)}`);
        console.log(`    🔗 https://www.bilibili.com/video/${v.bvid}\n`);
      });
      
      return videos;
    } else {
      console.log('⚠️ 未找到视频\n');
    }
  } catch (e) {
    console.log('❌ B站搜索错误:', e.message);
  }
  
  return [];
}

// ============ B站热榜筛选 ============
async function filterBilibiliHot(keyword) {
  console.log('\n========================================');
  console.log(`  🔥 B站热榜 筛选"${keyword}"`);
  console.log('========================================\n');
  
  try {
    const resp = await fetch('https://api.bilibili.com/x/web-interface/ranking/v2?rid=0&type=all');
    const videos = resp.data?.list || [];
    
    const results = videos.filter(v => 
      v.title?.includes(keyword) || 
      v.dynamic?.includes(keyword) ||
      v.desc?.includes(keyword)
    );
    
    if (results.length > 0) {
      console.log(`✅ 在热榜找到 ${results.length} 个:\n`);
      results.forEach((v, i) => {
        console.log(`${i+1}. ${v.title}`);
        console.log(`   👤 ${v.owner?.name} | 👁 ${formatNum(v.stat?.view)} | 👍 ${formatNum(v.stat?.like)}\n`);
      });
    } else {
      console.log('⚠️ B站热榜中未找到相关视频\n');
    }
    
    return results;
  } catch (e) {
    console.log('❌ 错误:', e.message);
    return [];
  }
}

// ============ B站弹幕热词 ============
async function getBilibiliHotKeywords() {
  console.log('\n========================================');
  console.log('  🔥 B站实时热搜词');
  console.log('========================================\n');
  
  try {
    const resp = await fetch('https://api.bilibili.com/x/web-interface/ranking/v2?rid=0&type=all');
    
    // 获取热门视频标题中的关键词
    const titles = resp.data?.list?.map(v => v.title) || [];
    
    // 搜索包含"三角洲"或"delta"的视频
    const target = '三角洲';
    const matches = titles.filter(t => t.includes(target));
    
    console.log('B站热榜中包含"三角洲"的内容:');
    if (matches.length > 0) {
      matches.forEach((t, i) => console.log(`  ${i+1}. ${t}`));
    } else {
      console.log('  (无)');
    }
    
    return matches;
  } catch (e) {
    console.log('❌ 错误:', e.message);
    return [];
  }
}

// ============ 微博热搜 ============
async function searchWeibo() {
  console.log('\n========================================');
  console.log('  🌐 微博热搜');
  console.log('========================================\n');
  
  try {
    const resp = await fetch('https://weibo.com/ajax/side/hotSearch');
    
    if (resp.data?.band_list) {
      const keyword = '三角洲';
      const matches = resp.data.band_list.filter(item => 
        item.word?.includes(keyword)
      );
      
      console.log('微博热搜榜 TOP 50:\n');
      resp.data.band_list.slice(0, 50).forEach((item, i) => {
        const hot = formatNum(item.num);
        const label = item.label_name ? `[${item.label_name}]` : '';
        console.log(`${(i+1).toString().padStart(2)}. ${item.word} ${label} (${hot})`);
      });
      
      if (matches.length > 0) {
        console.log('\n🔥 匹配"三角洲"的热搜:');
        matches.forEach(m => console.log(`  - ${m.word}`));
      }
      
      return resp.data.band_list;
    }
  } catch (e) {
    console.log('⚠️ 微博API需要登录');
  }
  
  return [];
}

// ============ IT之家 ============
async function searchIThome() {
  console.log('\n========================================');
  console.log('  🖥️ IT之家 游戏新闻');
  console.log('========================================\n');
  
  try {
    // IT之家游戏RSS
    const resp = await fetch('https://www.ithome.com/rss/');
    const items = resp.match(/<item[^>]*>([\s\S]*?)<\/item>/gi) || [];
    
    const keyword = '三角洲';
    const results = items.map(item => ({
      title: item.match(/<title><!\[CDATA\[([^\]]+)\]\]>/)?.[1] || '',
      link: item.match(/<link>([^<]+)<\/link>/)?.[1] || ''
    })).filter(item => item.title.includes(keyword));
    
    items.slice(0, 20).forEach((item, i) => {
      const title = item.match(/<title><!\[CDATA\[([^\]]+)\]\]>/)?.[1] || item.match(/<title>([^<]+)<\/title>/)?.[1] || '';
      const link = item.match(/<link>([^<]+)<\/link>/)?.[1] || '';
      console.log(`${(i+1).toString().padStart(2)}. ${title}`);
    });
    
    return results;
  } catch (e) {
    console.log('❌ IT之家错误:', e.message);
    return [];
  }
}

// ============ 抖音/头条 关键词 ============
async function searchToutiao() {
  console.log('\n========================================');
  console.log('  📰 今日头条/抖音 热搜');
  console.log('========================================\n');
  
  try {
    // 今日头条热搜
    const resp = await fetch('https://www.toutiao.com/hot-event/hot-board/?level=+level_1%3A%3E0&category=game&limit=20&timestamp=' + Date.now());
    
    // 尝试解析
    if (typeof resp === 'string') {
      const data = JSON.parse(resp.match(/\{.*\}/)?.[0] || '{}');
      console.log('头条数据:', JSON.stringify(data).substring(0, 500));
    } else {
      console.log('头条响应:', JSON.stringify(resp).substring(0, 500));
    }
  } catch (e) {
    console.log('⚠️ 头条API:', e.message);
  }
}

// ============ MAIN ============
async function main() {
  const keyword = process.argv[2] || '三角洲行动';
  
  console.log('\n🚀 三角洲行动 数据采集');
  console.log('========================================');
  console.log(`关键词: ${keyword}`);
  console.log('========================================');
  
  ensureDir(CONFIG.dataDir);
  
  // B站搜索
  const bilibiliVideos = await searchBilibili(keyword);
  
  // B站热榜筛选
  await filterBilibiliHot(keyword);
  
  // 微博热搜
  await searchWeibo();
  
  // IT之家
  await searchIThome();
  
  // 保存结果
  const results = {
    keyword,
    scrapedAt: new Date().toISOString(),
    bilibiliVideos
  };
  
  const file = path.join(CONFIG.dataDir, `delta-force-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify(results, null, 2));
  console.log(`\n✅ 已保存到 ${file}`);
  
  console.log('\n========================================');
  console.log('✅ 完成!');
  console.log('========================================\n');
}

main().catch(console.error);
