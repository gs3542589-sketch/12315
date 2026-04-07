/**
 * 游戏数据综合采集器
 * 采集：抖音、快手、微博超话、游民星空
 */

const https = require('https');
const http = require('http');
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
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/html, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(data); }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, function() { reject(new Error('timeout')); req.destroy(); });
  });
}

function formatNum(n) {
  if (!n) return '0';
  n = Number(n);
  if (n >= 100000000) return (n/100000000).toFixed(1) + '亿';
  if (n >= 10000) return (n/10000).toFixed(1) + 'w';
  return n.toLocaleString();
}

// ============ 抖音热搜 ============
async function searchDouyin() {
  console.log('\n========================================');
  console.log('  📱 抖音热搜榜');
  console.log('========================================\n');
  
  try {
    const resp = await fetch('https://www.douyin.com/aweme/v1/web/hot/search/list/?count=50&offset=0');
    
    if (resp.word_list) {
      console.log('抖音热搜 TOP 50:\n');
      resp.word_list.slice(0, 50).forEach((item, i) => {
        const word = item.word || item.query_word || '未知';
        const hot = formatNum(item.hot_value || item.score || 0);
        console.log(`${(i+1).toString().padStart(2)}. ${word} 🔥${hot}`);
      });
      
      // 筛选三角洲
      const matches = resp.word_list.filter(item => 
        (item.word || '').includes('三角洲')
      );
      
      if (matches.length > 0) {
        console.log('\n🔥 匹配"三角洲"的热搜:');
        matches.forEach(m => console.log(`  - ${m.word} 🔥${formatNum(m.hot_value)}`));
      }
      
      return resp.word_list;
    }
  } catch (e) {
    console.log('❌ 抖音热搜:', e.message);
  }
  
  return [];
}

// ============ 快手 ============
async function searchKuaishou() {
  console.log('\n========================================');
  console.log('  🎬 快手热榜');
  console.log('========================================\n');
  
  try {
    const resp = await fetch('https://www.kuaishou.com/?mod=search');
    
    if (typeof resp === 'string' && resp.includes('三角洲')) {
      console.log('✅ 快手包含"三角洲"相关内容');
    } else {
      console.log('⚠️ 快手需要登录查看');
    }
  } catch (e) {
    console.log('❌ 快手:', e.message);
  }
  
  return [];
}

// ============ 微博热搜 ============
async function searchWeibo() {
  console.log('\n========================================');
  console.log('  💬 微博热搜');
  console.log('========================================\n');
  
  try {
    const resp = await fetch('https://weibo.com/ajax/side/hotSearch');
    
    if (resp.data?.band_list) {
      console.log('微博热搜 TOP 50:\n');
      resp.data.band_list.slice(0, 50).forEach((item, i) => {
        const label = item.label_name ? `[${item.label_name}]` : '';
        console.log(`${(i+1).toString().padStart(2)}. ${item.word} ${label}`);
      });
      
      // 筛选
      const matches = resp.data.band_list.filter(item => 
        (item.word || '').includes('三角洲')
      );
      
      if (matches.length > 0) {
        console.log('\n🔥 匹配"三角洲"的热搜:');
        matches.forEach(m => console.log(`  - ${m.word}`));
      }
      
      return resp.data.band_list;
    }
  } catch (e) {
    console.log('⚠️ 微博需要登录');
  }
  
  return [];
}

// ============ 游民星空 ============
async function searchGamersky() {
  console.log('\n========================================');
  console.log('  🎮 游民星空 三角洲行动');
  console.log('========================================\n');
  
  try {
    const resp = await fetch('https://www.gamersky.com.cn/news/s?keyword=%E4%B8%89%E8%A7%92%E6%B4%B2%E8%A1%8C%E5%8A%A8');
    
    if (typeof resp === 'string') {
      const titles = resp.match(/tit[">\s]+([^<"]+)/gi) || [];
      const uniqueTitles = [...new Set(titles)].slice(0, 10);
      
      console.log('游民星空搜索结果:\n');
      uniqueTitles.forEach((t, i) => {
        console.log(`${i+1}. ${t}`);
      });
    }
  } catch (e) {
    console.log('❌ 游民星空:', e.message);
  }
}

// ============ 主函数 ============
async function main() {
  const keyword = '三角洲行动';
  
  console.log('\n🎮 游戏数据综合采集');
  console.log('========================================');
  console.log(`关键词: ${keyword}`);
  console.log('========================================');
  
  ensureDir(CONFIG.dataDir);
  
  // 抖音
  const douyinData = await searchDouyin();
  
  // 微博
  await searchWeibo();
  
  // 快手
  await searchKuaishou();
  
  // 游民星空
  await searchGamersky();
  
  // 保存
  const results = {
    keyword,
    scrapedAt: new Date().toISOString(),
    sources: {
      douyin: douyinData
    }
  };
  
  const file = path.join(CONFIG.dataDir, `game-data-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify(results, null, 2));
  console.log(`\n✅ 已保存到 ${file}`);
  
  console.log('\n========================================');
  console.log('✅ 完成!');
  console.log('========================================\n');
}

main().catch(console.error);
