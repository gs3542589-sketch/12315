const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  cookiePath: 'C:/Users/Administrator/linuxdo-storage-state.json',
  outputDir: 'C:/Users/Administrator/.qclaw/workspace-agent-1f90a168/data/linuxdo',
  keywords: ['免费', '公益', 'API', '中转', '额度', 'Token', 'Claude', 'GPT', 'Gemini', 'key', 'sk-', '免费额度'],
  maxPosts: 50
};

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

async function scrapeFreeAPIPosts(browser) {
  const context = await browser.newContext({
    storageState: CONFIG.cookiePath,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  const allPosts = [];
  
  // Search across multiple categories
  const searchUrls = [
    'https://linux.do/search?q=免费API',
    'https://linux.do/search?q=公益站',
    'https://linux.do/search?q=中转站',
    'https://linux.do/search?q=免费额度',
    'https://linux.do/c/福利羊毛/10',  // 福利羊毛板块
    'https://linux.do/c/资源荟萃/11'   // 资源荟萃板块
  ];
  
  for (const url of searchUrls) {
    try {
      log(`Searching: ${url}`);
      await page.goto(url, { timeout: 30000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      
      // Extract posts
      const posts = await page.$$eval('.topic-list-item, .search-result-topic', items => {
        return items.map(item => {
          const titleEl = item.querySelector('.link-top-line a, .topic-title a, a.title');
          const excerptEl = item.querySelector('.topic-excerpt, .blurb');
          const authorEl = item.querySelector('.author a, .username a');
          
          return {
            title: titleEl?.textContent?.trim() || '',
            url: titleEl?.href || '',
            excerpt: excerptEl?.textContent?.trim() || '',
            author: authorEl?.textContent?.trim() || 'Unknown',
            scrapedAt: new Date().toISOString()
          };
        }).filter(p => p.title);
      });
      
      allPosts.push(...posts);
      log(`  Found ${posts.length} posts`);
      
    } catch (error) {
      log(`  Error: ${error.message}`);
    }
  }
  
  await context.close();
  return allPosts;
}

function extractAPIInfo(posts) {
  const apiInfo = [];
  
  for (const post of posts) {
    const text = `${post.title} ${post.excerpt}`;
    
    // Patterns to extract
    const patterns = {
      // API Key patterns
      apiKey: /sk-[a-zA-Z0-9]{20,}/g,
      // URL patterns
      url: /https?:\/\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9\/._-]*/g,
      // Free quota patterns
      freeQuota: /免费[额|配].*?\d+|[送|赠].*?\d+.*?[刀|$|元]|\d+.*?[万|k].*?token/gi,
      // Platform names
      platform: /(老张|宙流|海鸥|anyrouter|xingjiabi|laozhang|zhouliu|hohy6)/gi
    };
    
    const matches = {
      title: post.title,
      url: post.url,
      author: post.author,
      apiKeys: text.match(patterns.apiKey) || [],
      urls: text.match(patterns.url) || [],
      freeQuota: text.match(patterns.freeQuota) || [],
      platforms: text.match(patterns.platform) || []
    };
    
    // Only keep posts with relevant info
    if (matches.apiKeys.length > 0 || matches.urls.length > 0 || matches.freeQuota.length > 0) {
      apiInfo.push(matches);
    }
  }
  
  return apiInfo;
}

function generateProviderConfig(apiInfo) {
  const providers = {};
  
  // Known free API platforms
  const platformConfigs = {
    '老张': { baseUrl: 'https://api.laozhang.ai/v1', models: ['gpt-4o', 'claude-3-5-sonnet'] },
    'laozhang': { baseUrl: 'https://api.laozhang.ai/v1', models: ['gpt-4o', 'claude-3-5-sonnet'] },
    '宙流': { baseUrl: 'https://zhouliuai.online/v1', models: ['gpt-4.5-preview'] },
    'zhouliu': { baseUrl: 'https://zhouliuai.online/v1', models: ['gpt-4.5-preview'] },
    '海鸥': { baseUrl: 'https://www.hohy6.com/v1', models: ['gpt-5', 'claude-opus'] },
    'hohy6': { baseUrl: 'https://www.hohy6.com/v1', models: ['gpt-5', 'claude-opus'] },
    'anyrouter': { baseUrl: 'https://anyrouter.top/v1', models: ['claude-3.5', 'gpt-4o'] },
    'xingjiabi': { baseUrl: 'https://xingjiabiapi.org/v1', models: ['claude-3.7', 'gpt-4o'] }
  };
  
  for (const info of apiInfo) {
    for (const platform of info.platforms) {
      const config = platformConfigs[platform.toLowerCase()];
      if (config) {
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

async function main() {
  log('=== Linux.do Free API Scraper ===');
  
  if (!fs.existsSync(CONFIG.cookiePath)) {
    log('❌ Cookie file not found!');
    process.exit(1);
  }
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  
  // Scrape posts
  const posts = await scrapeFreeAPIPosts(browser);
  log(`\nTotal posts scraped: ${posts.length}`);
  
  // Extract API info
  const apiInfo = extractAPIInfo(posts);
  log(`Posts with API info: ${apiInfo.length}`);
  
  // Generate provider config
  const providers = generateProviderConfig(apiInfo);
  log(`Generated ${Object.keys(providers).length} provider configs`);
  
  await browser.close();
  
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
  
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  
  // Also save provider config for easy import
  const configFile = path.join(CONFIG.outputDir, 'free-api-providers.json');
  fs.writeFileSync(configFile, JSON.stringify(providers, null, 2));
  
  log(`\n✅ Results saved to:`);
  log(`  - ${outputFile}`);
  log(`  - ${configFile}`);
  
  // Print summary
  if (apiInfo.length > 0) {
    log('\n📋 Found API Info:');
    apiInfo.slice(0, 5).forEach((info, i) => {
      log(`  ${i+1}. ${info.title}`);
      if (info.apiKeys.length) log(`     Keys: ${info.apiKeys.length} found`);
      if (info.urls.length) log(`     URLs: ${info.urls.slice(0, 2).join(', ')}`);
    });
  }
}

main().catch(error => {
  log(`Fatal error: ${error.message}`);
  process.exit(1);
});
