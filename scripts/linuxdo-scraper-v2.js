const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  cookiePath: 'C:/Users/Administrator/linuxdo-storage-state.json',
  cookieBackupPath: 'C:/Users/Administrator/linuxdo-storage-state-v2.json',
  outputDir: 'C:/Users/Administrator/.qclaw/workspace-agent-1f90a168/data/linuxdo',
  logDir: 'C:/Users/Administrator/.qclaw/workspace-agent-1f90a168/logs',
  forums: [
    { id: '10', name: '福利羊毛', slug: '福利羊毛' },
    { id: '11', name: '资源荟萃', slug: '资源荟萃' },
    { id: '2', name: '运营反馈', slug: '运营反馈' }
  ],
  maxRetries: 3,
  retryDelay: 5000,
  headless: true
};

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function scrapeWithRetry(browser, forum, retryCount = 0) {
  const context = await browser.newContext({
    storageState: fs.existsSync(CONFIG.cookieBackupPath) ? CONFIG.cookieBackupPath : CONFIG.cookiePath,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    const url = `https://linux.do/c/${forum.slug}/${forum.id}`;
    log(`Scraping: ${forum.name} (${url})`);
    
    await page.goto(url, { 
      timeout: 30000, 
      waitUntil: 'domcontentloaded' 
    });
    
    // Wait for content or challenge
    await page.waitForTimeout(5000);
    
    // Check if we're blocked by Cloudflare
    const title = await page.title();
    if (title.includes('Just a moment') || title.includes('请稍候')) {
      log(`⚠️ Cloudflare challenge detected for ${forum.name}`);
      await context.close();
      return { error: 'cloudflare_challenge', forum: forum.name };
    }
    
    // Try multiple selectors for topic list
    const selectors = [
      'tr.topic-list-item',
      '.topic-list-body tr',
      '.topic-list .topic-list-item',
      '[data-topic-id]'
    ];
    
    let posts = [];
    for (const selector of selectors) {
      const items = await page.$$eval(selector, rows => {
        return rows.slice(0, 20).map(row => {
          const titleEl = row.querySelector('.link-top-line a, .title a, a.title');
          const authorEl = row.querySelector('.author a, .username a');
          const repliesEl = row.querySelector('.posts-map, .replies');
          const viewsEl = row.querySelector('.num.views, .views');
          
          return {
            title: titleEl?.textContent?.trim() || '',
            url: titleEl?.href || '',
            author: authorEl?.textContent?.trim() || 'Unknown',
            replies: repliesEl?.textContent?.trim() || '0',
            views: viewsEl?.textContent?.trim() || '0',
            scrapedAt: new Date().toISOString()
          };
        }).filter(p => p.title);
      });
      
      if (items.length > 0) {
        posts = items;
        break;
      }
    }
    
    log(`✅ Found ${posts.length} posts in ${forum.name}`);
    
    // Update cookies if successful
    const newCookies = await context.cookies();
    if (newCookies.length > 0) {
      const newState = {
        cookies: newCookies.map(c => ({
          name: c.name, value: c.value, domain: c.domain, path: c.path,
          expires: c.expires || -1, httpOnly: c.httpOnly, secure: c.secure, sameSite: c.sameSite || 'Lax'
        })),
        origins: []
      };
      fs.writeFileSync(CONFIG.cookieBackupPath, JSON.stringify(newState, null, 2));
    }
    
    await context.close();
    return { success: true, forum: forum.name, posts };
    
  } catch (error) {
    log(`❌ Error scraping ${forum.name}: ${error.message}`);
    await context.close();
    
    if (retryCount < CONFIG.maxRetries) {
      log(`Retrying ${forum.name} (${retryCount + 1}/${CONFIG.maxRetries})...`);
      await new Promise(r => setTimeout(r, CONFIG.retryDelay));
      return scrapeWithRetry(browser, forum, retryCount + 1);
    }
    
    return { error: error.message, forum: forum.name };
  }
}

async function main() {
  log('=== Linux.do Daily Scraper v2 ===');
  
  await ensureDir(CONFIG.outputDir);
  await ensureDir(CONFIG.logDir);
  
  // Check cookie file
  if (!fs.existsSync(CONFIG.cookiePath)) {
    log('❌ Cookie file not found!');
    process.exit(1);
  }
  
  // Launch browser
  const browser = await chromium.launch({
    headless: CONFIG.headless,
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled']
  });
  
  const results = {};
  const errors = [];
  
  // Scrape each forum
  for (const forum of CONFIG.forums) {
    const result = await scrapeWithRetry(browser, forum);
    if (result.success) {
      results[forum.name] = result.posts;
    } else {
      errors.push(result);
      results[forum.name] = [];
    }
  }
  
  await browser.close();
  
  // Save results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputFile = path.join(CONFIG.outputDir, `scrape-${timestamp}.json`);
  const latestFile = path.join(CONFIG.outputDir, 'latest.json');
  
  const output = {
    scrapedAt: new Date().toISOString(),
    forums: results,
    errors: errors,
    summary: {
      totalPosts: Object.values(results).flat().length,
      forumsScraped: Object.keys(results).length,
      errors: errors.length
    }
  };
  
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  fs.writeFileSync(latestFile, JSON.stringify(output, null, 2));
  
  // Save log
  const logFile = path.join(CONFIG.logDir, `scrape-${timestamp.split('T')[0]}.log`);
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] Scraped: ${output.summary.totalPosts} posts, Errors: ${output.summary.errors}\n`);
  
  log(`✅ Scraping complete!`);
  log(`Output: ${outputFile}`);
  log(`Total posts: ${output.summary.totalPosts}`);
  
  if (errors.length > 0) {
    log(`⚠️ Errors: ${errors.length} forums failed`);
    errors.forEach(e => log(`  - ${e.forum}: ${e.error}`));
  }
  
  return output;
}

main().catch(error => {
  log(`Fatal error: ${error.message}`);
  process.exit(1);
});
