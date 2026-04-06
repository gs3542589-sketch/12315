const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    storageState: 'C:/Users/Administrator/linuxdo-storage-state.json',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  const page = await context.newPage();
  
  try {
    // Go to welfare category
    await page.goto('https://linux.do/c/%E7%A6%8F%E5%88%A9%E7%BE%8A%E6%AF%9B/10', { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    console.log('Page title:', await page.title());
    console.log('Page URL:', page.url());
    
    // Check for any error/login messages
    const bodyText = await page.$eval('body', el => el.textContent?.substring(0, 500));
    console.log('Body text preview:', bodyText);
    
    // Try different selectors
    const items = await page.$$eval('.topic-list-item, .search-result-topic, .category-topic-list li, .topic-list li', els => els.length);
    console.log('Topic items found:', items);
    
    // Get topic links
    const links = await page.$$eval('a[href*="/t/topic/"]', els => els.slice(0, 10).map(e => ({ title: e.textContent?.trim(), href: e.href })));
    console.log('Topic links:', JSON.stringify(links, null, 2));
    
  } catch (e) {
    console.error('Error:', e.message);
  }
  
  await browser.close();
})();
