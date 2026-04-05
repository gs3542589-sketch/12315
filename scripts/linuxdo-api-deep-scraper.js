const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  cookiePath: 'C:/Users/Administrator/linuxdo-storage-state.json',
  outputDir: 'C:/Users/Administrator/.qclaw/workspace-agent-1f90a168/data/linuxdo',
  // API related keywords to search
  searchKeywords: ['API', 'api', '中转', 'key', 'Key', 'sk-', 'token', 'Token', '免费', '额度', '额度', 'claude', 'gpt', 'GPT'],
};

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

async function scrapePostDetail(page, url) {
  try {
    await page.goto(url, { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    // Extract full post content
    const content = await page.evaluate(() => {
      // Try multiple selectors for post content
      const selectors = [
        '.post:not(.topic-body) .cooked',
        '.topic-body .cooked',
        '.post .cooked',
        '.d-editor-preview',
        '[data-post-id] .cooked',
        '.raw-post'
      ];
      
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) return el.innerText || el.textContent;
      }
      
      // Fallback: get all text from post area
      const postArea = document.querySelector('.topic-body, .post, .d-post');
      return postArea ? postArea.innerText.slice(0, 5000) : '';
    });
    
    return content;
  } catch (e) {
    return '';
  }
}

function extractAPIInfo(postContent, postTitle, postUrl) {
  const apiInfo = {
    title: postTitle,
    url: postUrl,
    found: [],
    timestamp: new Date().toISOString()
  };
  
  // API Key patterns
  const keyPatterns = [
    /sk-[a-zA-Z0-9]{20,}/g,
    /sk-ant-[a-zA-Z0-9]{20,}/g,
    /sk-[a-zA-Z0-9-]{30,}/g,
  ];
  
  // URL patterns (potential API endpoints)
  const urlPatterns = [
    /https?:\/\/[a-zA-Z0-9.-]+(?:\/v1|\/api|\/proxy|\/chat|\/completions)[a-zA-Z0-9\/._-]*/gi,
    /https?:\/\/[a-zA-Z0-9.-]+\/v1[a-zA-Z0-9\/._-]*/gi,
  ];
  
  // Platform mentions
  const platforms = [
    '老张API', 'laozhang', '宙流', 'zhouliu', '海鸥', 'hohy', 'anyrouter',
    'xingjiabi', '星接', 'APIKey', 'api.key', '免费API', '公益API',
    '中转站', '镜像站', '直连', '代理'
  ];
  
  // Extract keys
  for (const pattern of keyPatterns) {
    const matches = postContent.match(pattern);
    if (matches) {
      apiInfo.found.push({ type: 'API_KEY', value: matches[0].slice(0, 40) + '...' });
    }
  }
  
  // Extract URLs
  for (const pattern of urlPatterns) {
    const matches = postContent.match(pattern);
    if (matches) {
      matches.forEach(url => {
        if (!apiInfo.found.some(f => f.value === url)) {
          apiInfo.found.push({ type: 'URL', value: url.slice(0, 100) });
        }
      });
    }
  }
  
  // Check for platform mentions
  for (const platform of platforms) {
    if (postContent.includes(platform) || postTitle.includes(platform)) {
      apiInfo.found.push({ type: 'PLATFORM', value: platform });
    }
  }
  
  return apiInfo;
}

async function main() {
  log('=== Linux.do Free API Deep Scraper ===\n');
  
  if (!fs.existsSync(CONFIG.cookiePath)) {
    log('❌ Cookie file not found!');
    process.exit(1);
  }
  
  // Read previous scrape results
  const latestFile = path.join(CONFIG.outputDir, 'latest.json');
  if (!fs.existsSync(latestFile)) {
    log('❌ No previous scrape found. Run linuxdo-scraper-v2.js first.');
    process.exit(1);
  }
  
  const latest = JSON.parse(fs.readFileSync(latestFile, 'utf-8'));
  
  // Collect all post URLs
  const allPosts = [];
  for (const [forum, posts] of Object.entries(latest.forums)) {
    for (const post of posts) {
      // Filter posts with API-related keywords in title
      const hasKeyword = CONFIG.searchKeywords.some(kw => 
        post.title.includes(kw)
      );
      if (hasKeyword || post.title.includes('免费') || post.title.includes('API')) {
        allPosts.push({ ...post, forum });
      }
    }
  }
  
  log(`Found ${allPosts.length} potentially API-related posts to deep scrape\n`);
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  
  const context = await browser.newContext({
    storageState: CONFIG.cookiePath,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  const allAPIInfo = [];
  
  // Scrape top posts (limit to avoid timeout)
  const postsToScrape = allPosts.slice(0, 20);
  
  for (let i = 0; i < postsToScrape.length; i++) {
    const post = postsToScrape[i];
    log(`[${i+1}/${postsToScrape.length}] Scraping: ${post.title.slice(0, 50)}...`);
    
    const content = await scrapePostDetail(page, post.url);
    
    if (content) {
      const info = extractAPIInfo(content, post.title, post.url);
      if (info.found.length > 0) {
        allAPIInfo.push(info);
        log(`  ✅ Found ${info.found.length} items`);
      }
    } else {
      log(`  ⚠️ No content extracted`);
    }
  }
  
  await browser.close();
  
  // Save results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputFile = path.join(CONFIG.outputDir, `free-api-details-${timestamp}.json`);
  const providersFile = path.join(CONFIG.outputDir, 'free-api-providers.json');
  
  const output = {
    scrapedAt: new Date().toISOString(),
    postsScraped: postsToScrape.length,
    apiInfo: allAPIInfo,
    summary: {
      totalFound: allAPIInfo.length,
      keysFound: allAPIInfo.reduce((acc, i) => acc + i.found.filter(f => f.type === 'API_KEY').length, 0),
      urlsFound: allAPIInfo.reduce((acc, i) => acc + i.found.filter(f => f.type === 'URL').length, 0),
    }
  };
  
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  log(`\n✅ Results saved to: ${outputFile}`);
  
  // Print summary
  if (allAPIInfo.length > 0) {
    log('\n📋 Found API Info:');
    allAPIInfo.forEach((info, i) => {
      log(`\n${i+1}. ${info.title}`);
      info.found.forEach(f => {
        log(`   [${f.type}] ${f.value}`);
      });
    });
  } else {
    log('\n⚠️ No API keys or endpoints found in the scraped posts.');
    log('   This could mean:');
    log('   - Posts are behind login/auth');
    log('   - API info is in images (OCR needed)');
    log('   - Need to try different post selectors');
  }
  
  return output;
}

main().catch(e => {
  log(`Fatal error: ${e.message}`);
  process.exit(1);
});
