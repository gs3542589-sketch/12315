const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  cookiePath: 'C:/Users/Administrator/linuxdo-storage-state.json',
  outputDir: 'C:/Users/Administrator/.qclaw/workspace-agent-1f90a168/data/linuxdo',
};

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

async function scrapeCategoryAndExtract(page, categoryUrl, categoryName) {
  try {
    log(`Scraping category: ${categoryName}`);
    await page.goto(categoryUrl, { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    const title = await page.title();
    if (title.includes('Just a moment') || title.includes('请稍候')) {
      log(`  ⚠️ Cloudflare challenge`);
      return { category: categoryName, blocked: true, posts: [] };
    }
    
    // Extract posts with more details
    const posts = await page.$$eval('.topic-list-item', items => {
      return items.slice(0, 30).map(item => {
        const titleEl = item.querySelector('.link-top-line a, .title a');
        const authorEl = item.querySelector('.author a');
        const repliesEl = item.querySelector('.posts-map');
        const viewsEl = item.querySelector('.num.views');
        const activityEl = item.querySelector('.num.activity');
        const categoryEl = item.querySelector('.category-name, .badge-category');
        
        return {
          title: titleEl?.textContent?.trim() || '',
          url: titleEl?.href || '',
          author: authorEl?.textContent?.trim() || 'Unknown',
          replies: repliesEl?.textContent?.trim() || '0',
          views: viewsEl?.textContent?.trim() || '0',
          activity: activityEl?.textContent?.trim() || '',
          category: categoryEl?.textContent?.trim() || categoryName,
        };
      }).filter(p => p.title);
    });
    
    log(`  Found ${posts.length} posts`);
    return { category: categoryName, blocked: false, posts };
    
  } catch (e) {
    log(`  Error: ${e.message}`);
    return { category: categoryName, blocked: false, error: e.message, posts: [] };
  }
}

async function scrapePostDetail(page, url) {
  try {
    await page.goto(url, { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    const content = await page.evaluate(() => {
      const selectors = ['.topic-body .cooked', '.cooked', '.d-editor-preview'];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) return el.innerText;
      }
      return '';
    });
    
    return content || '';
  } catch (e) {
    return '';
  }
}

function extractAPIInfo(content, title, url) {
  const info = {
    title,
    url,
    items: [],
    confidence: 'low',
  };
  
  // API Key patterns
  const keyMatches = content.match(/sk-[a-zA-Z0-9]{20,}/g);
  if (keyMatches) {
    info.items.push(...keyMatches.map(k => ({ type: 'API_KEY', value: k.slice(0, 50) })));
    info.confidence = 'high';
  }
  
  // Base URL patterns
  const urlMatches = content.match(/https?:\/\/[a-zA-Z0-9.-]+(?:\/v1|\/v[0-9]|\/api)[^\s'"<>]*/gi);
  if (urlMatches) {
    [...new Set(urlMatches)].slice(0, 3).forEach(u => {
      info.items.push({ type: 'API_URL', value: u.slice(0, 100) });
    });
    info.confidence = 'high';
  }
  
  // Platform keywords
  const platforms = ['老张', 'laozhang', '宙流', 'zhouliu', '海鸥', 'hohy', 'anyrouter', 'xingjiabi', 'oneapi', 'OneAPI', '中转站', '公益API', '免费API', '免费额度'];
  platforms.forEach(p => {
    if (content.includes(p) || title.includes(p)) {
      info.items.push({ type: 'PLATFORM', value: p });
      if (info.confidence === 'low') info.confidence = 'medium';
    }
  });
  
  // Quota info
  const quotaMatches = content.match(/[\d.]+[\u4e00-\u9fa5]*(?:免费|赠送|额度|token|Tokens)[^\n]{0,50}/gi);
  if (quotaMatches) {
    quotaMatches.slice(0, 2).forEach(q => {
      info.items.push({ type: 'QUOTA', value: q.slice(0, 60) });
    });
  }
  
  return info;
}

async function main() {
  log('=== Linux.do API Deep Scrape v2 ===\n');
  
  // Categories to scrape
  const categories = [
    { name: '福利羊毛', url: 'https://linux.do/c/福利羊毛/10' },
    { name: '资源荟萃', url: 'https://linux.do/c/资源荟萃/11' },
    { name: '运营反馈', url: 'https://linux.do/c/运营反馈/2' },
    { name: '搞七捻三', url: 'https://linux.do/c/搞七捻三/4' },
  ];
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  
  const context = await browser.newContext({
    storageState: CONFIG.cookiePath,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  const allPosts = [];
  
  // Scrape each category
  for (const cat of categories) {
    const result = await scrapeCategoryAndExtract(page, cat.url, cat.name);
    if (result.posts.length > 0) {
      allPosts.push(...result.posts);
    }
    await page.waitForTimeout(1000);
  }
  
  log(`\nTotal posts scraped: ${allPosts.length}`);
  
  // Filter for API-related posts
  const apiKeywords = ['API', 'api', 'key', 'Key', 'token', 'Token', '免费', '额度', '中转', 'claude', 'gpt', 'GPT', '公益', '镜像', '直连'];
  const apiPosts = allPosts.filter(p => {
    const text = `${p.title} ${p.category}`;
    return apiKeywords.some(kw => text.includes(kw));
  });
  
  log(`API-related posts: ${apiPosts.length}`);
  
  // Deep scrape API posts
  const apiInfo = [];
  const postsToScrape = apiPosts.slice(0, 20);
  
  for (let i = 0; i < postsToScrape.length; i++) {
    const post = postsToScrape[i];
    log(`\n[${i+1}/${postsToScrape.length}] ${post.title.slice(0, 50)}...`);
    
    const content = await scrapePostDetail(page, post.url);
    
    if (content) {
      const info = extractAPIInfo(content, post.title, post.url);
      if (info.items.length > 0) {
        apiInfo.push(info);
        log(`  ✅ Found ${info.items.length} items`);
        info.items.forEach(item => log(`     [${item.type}] ${item.value.slice(0, 60)}`));
      } else {
        log(`  ⚠️ No API info`);
      }
    }
    
    await page.waitForTimeout(500);
  }
  
  await browser.close();
  
  // Save results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputFile = path.join(CONFIG.outputDir, `free-api-v2-${timestamp}.json`);
  const latestFile = path.join(CONFIG.outputDir, 'free-api-v2-latest.json');
  
  const output = {
    scrapedAt: new Date().toISOString(),
    totalPosts: allPosts.length,
    apiRelatedPosts: apiPosts.length,
    apiInfoFound: apiInfo,
    summary: {
      postsScraped: postsToScrape.length,
      postsWithAPIs: apiInfo.length,
      keysFound: apiInfo.reduce((acc, i) => acc + i.items.filter(f => f.type === 'API_KEY').length, 0),
      urlsFound: apiInfo.reduce((acc, i) => acc + i.items.filter(f => f.type === 'API_URL').length, 0),
    }
  };
  
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  fs.writeFileSync(latestFile, JSON.stringify(output, null, 2));
  
  log(`\n\n✅ Results saved to: ${outputFile}`);
  
  if (apiInfo.length > 0) {
    log('\n📋 FOUND API INFO:');
    apiInfo.forEach((info, i) => {
      log(`\n${i+1}. [${info.confidence.toUpperCase()}] ${info.title}`);
      info.items.forEach(item => log(`   - ${item.type}: ${item.value}`));
    });
  } else {
    log('\n⚠️ No API info found in current posts.');
    log('   The posts may be behind login or contain info in images.');
  }
  
  return output;
}

main().catch(e => {
  log(`Fatal error: ${e.message}`);
  process.exit(1);
});
