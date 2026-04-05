const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  
  const context = await browser.newContext({
    storageState: 'C:/Users/Administrator/linuxdo-storage-state.json'
  });
  
  const page = await context.newPage();
  
  console.log('Navigating to linux.do...');
  await page.goto('https://linux.do', { timeout: 30000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);
  
  console.log('Current URL:', page.url());
  
  // Take screenshot
  await page.screenshot({ path: 'C:/Users/Administrator/linuxdo-test.png', fullPage: true });
  console.log('Screenshot saved to linuxdo-test.png');
  
  // Get page content
  const content = await page.content();
  fs.writeFileSync('C:/Users/Administrator/linuxdo-content.html', content);
  console.log('HTML saved to linuxdo-content.html');
  
  // Check for login status
  const hasLogin = content.includes('登录') || content.includes('Sign in');
  const hasUserMenu = content.includes('user-menu') || content.includes('notifications');
  
  console.log('Login button found:', hasLogin);
  console.log('User menu found:', hasUserMenu);
  
  // Try to find topic list
  const topics = await page.$$eval('.topic-list-item, .topic-list-body tr', items => items.length);
  console.log('Topic items found:', topics);
  
  await browser.close();
})().catch(e => { console.error('Error:', e.message); process.exit(1); });
