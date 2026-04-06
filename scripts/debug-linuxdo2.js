const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    storageState: 'C:/Users/Administrator/linuxdo-storage-state.json',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  const page = await context.newPage();
  
  try {
    // Go to main page and find category links
    await page.goto('https://linux.do', { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    console.log('Page title:', await page.title());
    
    // Find category navigation links
    const categories = await page.$$eval('a[href*="/c/"]', els => 
      els.map(e => ({ title: e.textContent?.trim(), href: e.href }))
        .filter(e => e.title && e.href)
        .slice(0, 30)
    );
    console.log('Category links:', JSON.stringify(categories, null, 2));
    
    // Also try finding 福利羊毛 specifically
    const welfareLink = await page.$('a:has-text("福利羊毛")');
    if (welfareLink) {
      console.log('Found 福利羊毛 link:', await welfareLink.getAttribute('href'));
    }
    
    // Try searching for 福利羊毛
    await page.goto('https://linux.do/search?q=%E7%A6%8F%E5%88%A9%E7%BE%8A%E6%AF%9B', { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    console.log('Search page title:', await page.title());
    
    const searchResults = await page.$$eval('.search-result-topic, .topic-list-item', els => els.length);
    console.log('Search results:', searchResults);
    
    const searchLinks = await page.$$eval('a[href*="/t/topic/"]', els => 
      els.slice(0, 10).map(e => ({ title: e.textContent?.trim(), href: e.href }))
    );
    console.log('Search topic links:', JSON.stringify(searchLinks, null, 2));
    
  } catch (e) {
    console.error('Error:', e.message);
  }
  
  await browser.close();
})();
