const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// ============ CUSTOM STEALTH MODULE ============
const stealthPlugin = (browser) => {
  // This will be applied via browser arguments and init scripts
  return browser;
};

// Stealth init script - injected into every page
const stealthInitScript = () => {
  // 1. Hide webdriver
  Object.defineProperty(navigator, 'webdriver', { get: () => false });
  
  // 2. Hide automation flags
  window.navigator.chrome = { runtime: {}, loadTimes: () => {}, csi: () => {} };
  
  // 3. Mock permissions
  const originalQuery = window.navigator.permissions.query;
  window.navigator.permissions.query = (parameters) => (
    parameters.name === 'notifications' ?
      Promise.resolve({ state: Notification.permission }) :
      originalQuery(parameters)
  );
  
  // 4. Hide automation-related properties
  Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
  Object.defineProperty(navigator, 'languages', { get: () => ['zh-CN', 'zh', 'en'] });
  
  // 5. Override getHardwareConcurrency
  Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
  
  // 6. Override getDeviceMemory
  Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 });
  
  // 7. Remove automation specific variables
  delete window.cdc_adoQpoasnfa76pfcZLmcfl_Array;
  delete window.cdc_adoQpoasnfa76pfcZLmcfl_Promise;
  delete window.cdc_adoQpoasnfa76pfcZLmcfl_Symbol;
  
  // 8. Fix location
  if (window.location) {
    window.location.href = 'https://linux.do/';
  }
  
  // 9. Mock mediaDevices
  if (navigator.mediaDevices) {
    navigator.mediaDevices.enumerateDevices = () => Promise.resolve([
      { kind: 'audioinput', deviceId: 'default', label: '' },
      { kind: 'videoinput', deviceId: 'default', label: '' }
    ]);
  }
};

// ============ CONFIGURATION ============
const CONFIG = {
  forums: [
    { name: '福利羊毛', url: 'https://linux.do/c/%E7%A6%8F%E5%88%A9%E7%BE%8A%E6%AF%9B/10' },
    { name: '资源荟萃', url: 'https://linux.do/c/%E8%B5%84%E6%BA%90%E8%8D%9F%E8%90%83/11' },
    { name: '运营反馈', url: 'https://linux.do/c/%E8%BF%90%E8%90%A5%E5%8F%8D%E9%A6%88/2' }
  ],
  cookiePath: 'C:/Users/Administrator/linuxdo-storage-state.json',
  outputDir: 'C:/Users/Administrator/.qclaw/workspace-agent-1f90a168/data/linuxdo',
  maxPostsPerForum: 20,
  headless: true,
  // Anti-detection settings
  minDelay: 2000,
  maxDelay: 5000,
  userAgents: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
  ]
};

// ============ UTILITY FUNCTIONS ============
function randomDelay() {
  const delay = CONFIG.minDelay + Math.random() * (CONFIG.maxDelay - CONFIG.minDelay);
  return new Promise(resolve => setTimeout(resolve, delay));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomUserAgent() {
  return CONFIG.userAgents[Math.floor(Math.random() * CONFIG.userAgents.length)];
}

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// ============ BROWSER CREATION ============
async function createStealthBrowser() {
  console.log('🔒 Launching stealth browser...');
  
  const userAgent = getRandomUserAgent();
  
  const browser = await chromium.launch({
    headless: CONFIG.headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--exclude-switches=enable-automation',
      '--disable-infobars',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-web-security',
      '--allow-running-insecure-content',
      '--disable-extensions',
      '--window-size=1920,1080',
      '--disable-webgl',
      '--disable-logging',
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-site-isolation-trials'
    ]
  });
  
  const context = await browser.newContext({
    storageState: CONFIG.cookiePath,
    viewport: { 
      width: randomInt(1200, 1920), 
      height: randomInt(800, 1080) 
    },
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    colorScheme: 'light',
    userAgent: userAgent,
    extraHTTPHeaders: {
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0'
    }
  });
  
  const page = await context.newPage();
  
  // Inject stealth scripts
  await page.addInitScript(stealthInitScript);
  
  console.log(`✅ Stealth browser ready (User-Agent: Chrome)`);
  return { browser, context, page };
}

// ============ SCRAPING FUNCTIONS ============
async function scrapeForum(page, forum) {
  console.log(`\n📌 Scraping: ${forum.name}`);
  
  try {
    // Human-like navigation: visit homepage first
    console.log('  🚶 Visiting homepage...');
    await page.goto('https://linux.do/', { 
      timeout: 30000, 
      waitUntil: 'domcontentloaded' 
    }).catch(() => {});
    
    await randomDelay();
    
    // Now visit the target forum
    console.log('  🎯 Navigating to forum...');
    await page.goto(forum.url, { 
      timeout: 30000, 
      waitUntil: 'networkidle',
      referer: 'https://linux.do/'
    });
    
    // Wait for content to render
    await page.waitForTimeout(2000);
    
    // Scroll down slowly (simulate reading)
    console.log('  📜 Scrolling content...');
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 200));
      await page.waitForTimeout(500);
    }
    
    // Extract post data
    const posts = await page.evaluate((maxPosts) => {
      const items = [];
      const rows = document.querySelectorAll('tr.topic-list-item');
      
      Array.from(rows).slice(0, maxPosts).forEach(row => {
        const titleEl = row.querySelector('.link-top-line a');
        const authorEl = row.querySelector('.author a');
        const repliesEl = row.querySelector('.posts-map');
        const viewsEl = row.querySelector('.num.views');
        const activityEl = row.querySelector('.num.activity');
        
        if (titleEl) {
          items.push({
            title: titleEl.textContent.trim(),
            url: titleEl.href,
            author: authorEl ? authorEl.textContent.trim() : 'Unknown',
            replies: repliesEl ? repliesEl.textContent.trim() : '0',
            views: viewsEl ? viewsEl.textContent.trim() : '0',
            activity: activityEl ? activityEl.textContent.trim() : '',
            scrapedAt: new Date().toISOString()
          });
        }
      });
      
      return items;
    }, CONFIG.maxPostsPerForum);
    
    console.log(`  ✅ Found ${posts.length} posts`);
    return posts;
    
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return [];
  }
}

// ============ MAIN FUNCTION ============
async function main() {
  console.log('========================================');
  console.log('   Linux.do Stealth Scraper v2.0       ');
  console.log('========================================');
  console.log('Time:', new Date().toISOString());
  
  if (!fs.existsSync(CONFIG.cookiePath)) {
    console.error('❌ Cookie file not found:', CONFIG.cookiePath);
    console.log('   Run fetch-linuxdo-cookies.js first');
    process.exit(1);
  }
  
  await ensureDir(CONFIG.outputDir);
  
  const { browser, context, page } = await createStealthBrowser();
  const results = {};
  
  // Scrape each forum
  for (let i = 0; i < CONFIG.forums.length; i++) {
    const forum = CONFIG.forums[i];
    const posts = await scrapeForum(page, forum);
    results[forum.name] = posts;
    
    // Random delay between forums
    if (i < CONFIG.forums.length - 1) {
      console.log('  ⏳ Preparing next forum...');
      await randomDelay();
    }
  }
  
  // Save cookies for future use
  await context.storageState({ path: CONFIG.cookiePath });
  await browser.close();
  
  // Save results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputFile = path.join(CONFIG.outputDir, `scrape-${timestamp}.json`);
  
  const output = {
    scrapedAt: new Date().toISOString(),
    forums: results,
    summary: {
      totalPosts: Object.values(results).flat().length,
      forumsScraped: Object.keys(results).length
    }
  };
  
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  
  // Also save as latest
  const latestFile = path.join(CONFIG.outputDir, 'latest.json');
  fs.writeFileSync(latestFile, JSON.stringify(output, null, 2));
  
  console.log('\n========================================');
  console.log('✅ Scraping complete!');
  console.log('📁 Output:', outputFile);
  console.log('📊 Total posts:', output.summary.totalPosts);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
