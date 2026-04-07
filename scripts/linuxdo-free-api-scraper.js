const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// ============ CUSTOM STEALTH MODULE ============
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
  
  // 8. Mock mediaDevices
  if (navigator.mediaDevices) {
    navigator.mediaDevices.enumerateDevices = () => Promise.resolve([
      { kind: 'audioinput', deviceId: 'default', label: '' },
      { kind: 'videoinput', deviceId: 'default', label: '' }
    ]);
  }
};

// ============ CONFIGURATION ============
const CONFIG = {
  cookiePath: 'C:/Users/Administrator/linuxdo-storage-state.json',
  outputDir: 'C:/Users/Administrator/.qclaw/workspace-agent-1f90a168/data/linuxdo',
  maxPosts: 50,
  // Anti-detection settings
  minDelay: 3000,
  maxDelay: 8000,
  userAgents: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0'
  ]
};

// ============ UTILITY FUNCTIONS ============
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

function randomDelay() {
  const delay = CONFIG.minDelay + Math.random() * (CONFIG.maxDelay - CONFIG.minDelay);
  log(`  ⏳ Waiting ${(delay/1000).toFixed(1)}s...`);
  return new Promise(resolve => setTimeout(resolve, delay));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomUserAgent() {
  return CONFIG.userAgents[Math.floor(Math.random() * CONFIG.userAgents.length)];
}

// ============ BROWSER CREATION ============
async function createStealthBrowser() {
  log('🔒 Creating stealth browser...');
  
  const userAgent = getRandomUserAgent();
  
  const browser = await chromium.launch({
    headless: true,
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
      '--disable-features=IsolateOrigins,site-per-process'
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
  
  log('✅ Stealth browser ready');
  return { browser, context, page };
}

// ============ SCRAPING FUNCTIONS ============
async function scrapeFreeAPIPosts(browser) {
  const { context, page } = await createStealthBrowser();
  const allPosts = [];
  
  const searchQueries = [
    { name: '福利羊毛', url: 'https://linux.do/c/welfare/36' },
    { name: '资源荟萃', url: 'https://linux.do/c/resource/14' },
    { name: '搜索-免费API', url: 'https://linux.do/search?q=%E5%85%8D%E8%B4%B9API' },
    { name: '搜索-公益站', url: 'https://linux.do/search?q=%E5%85%AC%E7%9B%8A%E7%AB%AD' },
    { name: '搜索-中转', url: 'https://linux.do/search?q=%E4%B8%AD%E8%BD%AC%E7%AB%AD' },
    { name: '搜索-APIkey', url: 'https://linux.do/search?q=API+key' }
  ];
  
  for (let i = 0; i < searchQueries.length; i++) {
    const search = searchQueries[i];
    try {
      log(`\n📌 [${i+1}/${searchQueries.length}] ${search.name}`);
      
      // Human-like navigation: visit homepage first
      log('  🚶 Warming up...');
      await page.goto('https://linux.do/', { 
        timeout: 30000, 
        waitUntil: 'domcontentloaded' 
      }).catch(() => {});
      
      await randomDelay();
      
      // Now visit the target page
      log(`  🎯 Loading ${search.name}...`);
      await page.goto(search.url, { 
        timeout: 30000, 
        waitUntil: 'networkidle',
        referer: 'https://linux.do/'
      });
      
      // Wait for dynamic content
      await page.waitForTimeout(2000 + Math.random() * 2000);
      
      // Slow scroll to simulate reading
      log('  📜 Scrolling content...');
      for (let j = 0; j < 3; j++) {
        await page.evaluate(() => window.scrollBy(0, 300));
        await page.waitForTimeout(800);
      }
      
      // Extract posts with improved selector
      const posts = await page.evaluate((maxItems) => {
        const items = [];
        const seen = new Set();
        
        // Try multiple selectors
        const selectors = [
          'tr.topic-list-item a.title',
          '.topic-list-item a.link-top-line',
          'a[href*="/t/topic/"]',
          '.post-list a[data-topic-id]',
          'h3 a[href*="topic"]'
        ];
        
        let links = [];
        for (const sel of selectors) {
          links = [...document.querySelectorAll(sel)];
          if (links.length > 0) break;
        }
        
        links.slice(0, maxItems).forEach(link => {
          const href = link.href;
          const text = link.textContent?.trim() || '';
          
          // Filter duplicates and invalid links
          if (seen.has(href)) return;
          if (!text || text.length < 5) return;
          if (/^\d+$/.test(text)) return;
          if (href.includes('/u/') && !href.includes('/t/topic/')) return;
          
          seen.add(href);
          
          // Try to get excerpt
          let excerpt = '';
          const parent = link.closest('tr, li, .topic-item, article');
          if (parent) {
            const ex = parent.querySelector('.topic-excerpt, .blurb, .excerpt, .post');
            excerpt = ex?.textContent?.trim() || '';
          }
          
          items.push({
            title: text,
            url: href,
            excerpt: excerpt.substring(0, 200),
            scrapedAt: new Date().toISOString()
          });
        });
        
        return items;
      }, 30);
      
      allPosts.push(...posts);
      log(`  ✅ Found ${posts.length} posts`);
      
    } catch (error) {
      log(`  ❌ Error: ${error.message}`);
    }
    
    // Random delay between pages
    if (i < searchQueries.length - 1) {
      await randomDelay();
    }
  }
  
  // Save updated cookies
  await context.storageState({ path: CONFIG.cookiePath });
  await browser.close();
  return allPosts;
}

// ============ DATA PROCESSING ============
function extractAPIInfo(posts) {
  const apiInfo = [];
  
  // Patterns to detect
  const patterns = {
    apiKey: /sk-[a-zA-Z0-9]{20,}|[a-zA-Z0-9]{32,}:[a-zA-Z0-9]{32,}/g,
    url: /https?:\/\/[a-zA-Z0-9][a-zA-Z0-9.-]+\/[^\s<>"]*/g,
    freeQuota: /免费[\u4e00-\u9fa5]*\d+|赠送?\d+|送{1,2}\d+|[\d.]+[万kK个]*[\u4e00-\u9fa5]*[token|Tokens|额度]/gi,
    platforms: /(老张|宙流|海鸥|anyrouter|laozhang|zhouliu|hohy|xingjiabi|anyproxy)/gi
  };
  
  for (const post of posts) {
    const text = `${post.title} ${post.excerpt}`;
    
    const matches = {
      title: post.title,
      url: post.url,
      apiKeys: [...new Set(text.match(patterns.apiKey) || [])],
      urls: [...new Set((text.match(patterns.url) || []).slice(0, 3))],
      freeQuota: [...new Set(text.match(patterns.freeQuota) || [])],
      platforms: [...new Set((text.match(patterns.platforms) || []))]
    };
    
    // Keep posts with useful info
    if (matches.apiKeys.length > 0 || matches.urls.length > 0) {
      apiInfo.push(matches);
    }
  }
  
  return apiInfo;
}

function generateProviderConfig(apiInfo) {
  const providers = {};
  
  const platformConfigs = {
    '老张': { baseUrl: 'https://api.laozhang.ai/v1', models: ['gpt-4o', 'claude-3-5-sonnet'] },
    'laozhang': { baseUrl: 'https://api.laozhang.ai/v1', models: ['gpt-4o', 'claude-3-5-sonnet'] },
    '宙流': { baseUrl: 'https://zhouliuai.online/v1', models: ['gpt-4.5-preview'] },
    'zhouliu': { baseUrl: 'https://zhouliuai.online/v1', models: ['gpt-4.5-preview'] },
    '海鸥': { baseUrl: 'https://www.hohy6.com/v1', models: ['gpt-5', 'claude-opus'] },
    'hohy': { baseUrl: 'https://www.hohy6.com/v1', models: ['gpt-5', 'claude-opus'] },
    'anyrouter': { baseUrl: 'https://anyrouter.top/v1', models: ['claude-3.5', 'gpt-4o'] },
    'anyproxy': { baseUrl: 'https://anyproxy.net/v1', models: ['gpt-4o', 'claude-3'] },
    'xingjiabi': { baseUrl: 'https://xingjiabiapi.org/v1', models: ['claude-3.7', 'gpt-4o'] }
  };
  
  for (const info of apiInfo) {
    for (const platform of info.platforms) {
      const config = platformConfigs[platform.toLowerCase()];
      if (config && !providers[`free-${platform.toLowerCase()}`]) {
        providers[`free-${platform.toLowerCase()}`] = {
          baseUrl: config.baseUrl,
          apiKey: info.apiKeys[0] || '${API_KEY_PLACEHOLDER}',
          api: 'openai-completions',
          models: config.models.map(m => ({ id: m, name: m }))
        };
      }
    }
  }
  
  return providers;
}

// ============ MAIN ============
async function main() {
  log('========================================');
  log('   Linux.do Free API Stealth Scraper   ');
  log('========================================');
  
  if (!fs.existsSync(CONFIG.cookiePath)) {
    log('❌ Cookie file not found!');
    log('   Run fetch-linuxdo-cookies.js first');
    process.exit(1);
  }
  
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  const browser = await chromium.launch({ headless: true });
  const posts = await scrapeFreeAPIPosts(browser);
  
  log(`\n📊 Scraping Summary:`);
  log(`   Total posts scraped: ${posts.length}`);
  
  const apiInfo = extractAPIInfo(posts);
  log(`   Posts with API info: ${apiInfo.length}`);
  
  const providers = generateProviderConfig(apiInfo);
  log(`   Provider configs: ${Object.keys(providers).length}`);
  
  // Save results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputFile = path.join(CONFIG.outputDir, `free-apis-${timestamp}.json`);
  
  const output = {
    scrapedAt: new Date().toISOString(),
    posts: posts.slice(0, CONFIG.maxPosts),
    apiInfo,
    providers,
    summary: {
      totalPosts: posts.length,
      apiInfoCount: apiInfo.length,
      providerCount: Object.keys(providers).length
    }
  };
  
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  
  const configFile = path.join(CONFIG.outputDir, 'free-api-providers.json');
  fs.writeFileSync(configFile, JSON.stringify(providers, null, 2));
  
  log(`\n✅ Results saved:`);
  log(`   📄 ${outputFile}`);
  log(`   📄 ${configFile}`);
  
  // Print found APIs
  if (apiInfo.length > 0) {
    log('\n📋 Top API Sources:');
    apiInfo.slice(0, 5).forEach((info, i) => {
      log(`   ${i+1}. ${info.title}`);
      if (info.urls.length) log(`      🔗 ${info.urls[0].substring(0, 60)}...`);
    });
  }
  
  log('\n========================================');
}

main().catch(error => {
  log(`Fatal error: ${error.message}`);
  process.exit(1);
});
