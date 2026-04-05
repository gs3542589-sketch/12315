const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Forum URLs to scrape
  forums: [
    { name: '福利羊毛', url: 'https://linux.do/c/福利羊毛/10' },
    { name: '资源荟萃', url: 'https://linux.do/c/资源荟萃/11' },
    { name: '运营反馈', url: 'https://linux.do/c/运营反馈/2' }
  ],
  // Storage paths
  cookiePath: 'C:/Users/Administrator/linuxdo-storage-state.json',
  outputDir: 'C:/Users/Administrator/.qclaw/workspace-agent-1f90a168/data/linuxdo',
  // Scrape settings
  maxPostsPerForum: 20,
  headless: true
};

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function scrapeForum(browser, forum) {
  console.log(`\n📌 Scraping: ${forum.name}`);
  
  const context = await browser.newContext({
    storageState: CONFIG.cookiePath
  });
  const page = await context.newPage();
  
  try {
    await page.goto(forum.url, { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
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
    
    console.log(`  Found ${posts.length} posts`);
    
    await context.close();
    return posts;
    
  } catch (error) {
    console.error(`  Error scraping ${forum.name}:`, error.message);
    await context.close();
    return [];
  }
}

async function main() {
  console.log('=== Linux.do Daily Scraper ===');
  console.log('Time:', new Date().toISOString());
  
  // Check cookie file exists
  if (!fs.existsSync(CONFIG.cookiePath)) {
    console.error('❌ Cookie file not found:', CONFIG.cookiePath);
    process.exit(1);
  }
  
  // Ensure output directory
  await ensureDir(CONFIG.outputDir);
  
  // Launch browser
  const browser = await chromium.launch({
    headless: CONFIG.headless,
    args: ['--no-sandbox']
  });
  
  const results = {};
  
  // Scrape each forum
  for (const forum of CONFIG.forums) {
    const posts = await scrapeForum(browser, forum);
    results[forum.name] = posts;
  }
  
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
  
  console.log('\n✅ Scraping complete!');
  console.log('Output:', outputFile);
  console.log('Total posts:', output.summary.totalPosts);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
