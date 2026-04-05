const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  cookiePath: 'C:/Users/Administrator/linuxdo-storage-state.json',
  outputDir: 'C:/Users/Administrator/.qclaw/workspace-agent-1f90a168/data/linuxdo',
  searchTerms: ['免费API', '公益站', 'API中转', '免费额度', 'sk-', 'API Key', 'claude key', 'gpt key', 'token额度'],
};

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

async function scrapeSearchResults(page, searchTerm) {
  try {
    const encodedTerm = encodeURIComponent(searchTerm);
    const url = `https://linux.do/search?q=${encodedTerm}`;
    log(`Searching: ${searchTerm}`);
    
    await page.goto(url, { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    // Check if blocked by Cloudflare
    const title = await page.title();
    if (title.includes('Just a moment') || title.includes('请稍候')) {
      log(`  ⚠️ Cloudflare challenge detected`);
      return [];
    }
    
    // Extract search results
    const results = await page.$$eval('.search-result-topic, .topic-list-item', items => {
      return items.slice(0, 15).map(item => {
        const titleEl = item.querySelector('.link-top-line a, .topic-title a, a.title');
        const excerptEl = item.querySelector('.search-result-blurb, .topic-excerpt, .blurb');
        const authorEl = item.querySelector('.author a, .username a');
        const repliesEl = item.querySelector('.posts-map, .replies-count');
        const viewsEl = item.querySelector('.num.views');
        
        return {
          title: titleEl?.textContent?.trim() || '',
          url: titleEl?.href || '',
          excerpt: excerptEl?.textContent?.trim() || '',
          author: authorEl?.textContent?.trim() || 'Unknown',
          replies: repliesEl?.textContent?.trim() || '0',
          views: viewsEl?.textContent?.trim() || '0',
        };
      }).filter(p => p.title && p.url);
    });
    
    log(`  Found ${results.length} results`);
    return results;
    
  } catch (e) {
    log(`  Error: ${e.message}`);
    return [];
  }
}

async function scrapePostContent(page, url) {
  try {
    await page.goto(url, { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    const content = await page.evaluate(() => {
      // Try various selectors for post content
      const selectors = [
        '.topic-body .cooked',
        '.post:not(.topic-body) .cooked', 
        '.d-editor-preview',
        '.post .cooked',
        '.raw-post',
        '.cooked'
      ];
      
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) {
          return el.innerText || el.textContent;
        }
      }
      
      // Fallback: get all text from main content area
      const mainContent = document.querySelector('#main, .main-content, article');
      return mainContent ? mainContent.innerText.slice(0, 8000) : '';
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
  };
  
  // API Key patterns
  const keyMatches = content.match(/sk-[a-zA-Z0-9]{20,}/g);
  if (keyMatches) {
    keyMatches.forEach(key => {
      info.items.push({ type: 'API_KEY', value: key.slice(0, 50) });
    });
  }
  
  // Base URL patterns (potential API endpoints)
  const urlMatches = content.match(/https?:\/\/[a-zA-Z0-9.-]+(?:\/v1|\/v[0-9]|\/api|\/proxy|\/chat|\/completions)[^\s'"<>]*/gi);
  if (urlMatches) {
    const uniqueUrls = [...new Set(urlMatches)];
    uniqueUrls.slice(0, 5).forEach(url => {
      info.items.push({ type: 'API_URL', value: url.slice(0, 100) });
    });
  }
  
  // Platform info
  const platforms = ['老张', 'laozhang', '宙流', 'zhouliu', '海鸥', 'hohy', 'anyrouter', 'xingjiabi', '星接', 'oneapi', 'OneAPI'];
  platforms.forEach(p => {
    if (content.includes(p) || title.includes(p)) {
      info.items.push({ type: 'PLATFORM', value: p });
    }
  });
  
  // Quota info
  const quotaMatches = content.match(/[\d.]+[\u4e00-\u9fa5]*(?:免费|赠送|额度|token|Tokens)[\u4e00-\u9fa5\d.]*/gi);
  if (quotaMatches) {
    quotaMatches.slice(0, 3).forEach(q => {
      info.items.push({ type: 'QUOTA', value: q.slice(0, 50) });
    });
  }
  
  return info;
}

async function main() {
  log('=== Linux.do Free API Search & Extract ===\n');
  
  if (!fs.existsSync(CONFIG.cookiePath)) {
    log('❌ Cookie file not found!');
    return;
  }
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  
  const context = await browser.newContext({
    storageState: CONFIG.cookiePath,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  const allResults = [];
  const allAPIInfo = [];
  
  // Search for each term
  for (const term of CONFIG.searchTerms) {
    const results = await scrapeSearchResults(page, term);
    allResults.push(...results);
    await page.waitForTimeout(1000);
  }
  
  // Deduplicate by URL
  const uniqueResults = [];
  const seenUrls = new Set();
  for (const r of allResults) {
    if (!seenUrls.has(r.url)) {
      seenUrls.add(r.url);
      uniqueResults.push(r);
    }
  }
  
  log(`\nTotal unique posts: ${uniqueResults.length}`);
  
  // Deep scrape top posts
  const postsToScrape = uniqueResults.slice(0, 15);
  
  for (let i = 0; i < postsToScrape.length; i++) {
    const post = postsToScrape[i];
    log(`\n[${i+1}/${postsToScrape.length}] ${post.title.slice(0, 60)}...`);
    
    const content = await scrapePostContent(page, post.url);
    
    if (content) {
      const info = extractAPIInfo(content, post.title, post.url);
      if (info.items.length > 0) {
        allAPIInfo.push(info);
        log(`  ✅ Found ${info.items.length} API items:`);
        info.items.forEach(item => {
          log(`     [${item.type}] ${item.value}`);
        });
      } else {
        log(`  ⚠️ No API info in content`);
      }
    }
    
    await page.waitForTimeout(500);
  }
  
  await browser.close();
  
  // Save results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputFile = path.join(CONFIG.outputDir, `free-api-search-${timestamp}.json`);
  const latestFile = path.join(CONFIG.outputDir, 'free-api-latest.json');
  
  const output = {
    scrapedAt: new Date().toISOString(),
    searchTerms: CONFIG.searchTerms,
    postsSearched: uniqueResults.length,
    apiInfoFound: allAPIInfo,
    summary: {
      postsWithAPIs: allAPIInfo.length,
      totalKeys: allAPIInfo.reduce((acc, i) => acc + i.items.filter(f => f.type === 'API_KEY').length, 0),
      totalURLs: allAPIInfo.reduce((acc, i) => acc + i.items.filter(f => f.type === 'API_URL').length, 0),
    }
  };
  
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  fs.writeFileSync(latestFile, JSON.stringify(output, null, 2));
  
  log(`\n\n✅ Results saved to: ${outputFile}`);
  
  if (allAPIInfo.length > 0) {
    log('\n📋 SUMMARY OF FOUND API INFO:');
    allAPIInfo.forEach((info, i) => {
      log(`\n${i+1}. ${info.title}`);
      info.items.forEach(item => log(`   - ${item.type}: ${item.value}`));
    });
  }
  
  return output;
}

main().catch(e => {
  log(`Fatal error: ${e.message}`);
  process.exit(1);
});
