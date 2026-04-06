const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    storageState: 'C:/Users/Administrator/linuxdo-storage-state.json',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  const page = await context.newPage();
  
  try {
    // Go to correct welfare category
    await page.goto('https://linux.do/c/welfare/36', { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    console.log('Page title:', await page.title());
    console.log('Page URL:', page.url());
    
    // Get topic links
    const links = await page.$$eval('a[href*="/t/topic/"]', els => 
      els.slice(0, 20).map(e => ({ title: e.textContent?.trim(), href: e.href }))
    );
    console.log('Topic links count:', links.length);
    console.log('Links:', JSON.stringify(links, null, 2));
    
  } catch (e) {
    console.error('Error:', e.message);
  }
  
  await browser.close();
})();
