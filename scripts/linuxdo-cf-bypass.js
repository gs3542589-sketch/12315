const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  console.log('=== Testing Linux.do with Cloudflare bypass ===\n');
  
  // Read cookies
  const cookieState = JSON.parse(fs.readFileSync('C:/Users/Administrator/linuxdo-storage-state.json', 'utf-8'));
  
  // Launch browser with specific args to help with Cloudflare
  const browser = await chromium.launch({
    headless: false, // Need to see the browser for CF challenge
    args: [
      '--no-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });
  
  const context = await browser.newContext({
    storageState: cookieState,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  console.log('Navigating to linux.do...');
  console.log('If Cloudflare challenge appears, please complete it manually.\n');
  
  await page.goto('https://linux.do', { timeout: 60000 });
  
  // Wait for either challenge completion or page load
  console.log('Waiting for page to load (30 seconds)...');
  await page.waitForTimeout(30000);
  
  const url = page.url();
  const title = await page.title();
  
  console.log('\nCurrent URL:', url);
  console.log('Page title:', title);
  
  // Check if we're past Cloudflare
  if (title.includes('Just a moment')) {
    console.log('\n⚠️ Still on Cloudflare challenge page');
    console.log('Please complete the challenge manually in the browser window.');
    console.log('Waiting 60 seconds...');
    await page.waitForTimeout(60000);
  }
  
  // Get updated cookies
  const newCookies = await context.cookies();
  const cfCookie = newCookies.find(c => c.name === 'cf_clearance');
  
  if (cfCookie) {
    console.log('\n✅ Updated cf_clearance cookie obtained');
    
    // Update storage state
    const newState = {
      cookies: newCookies.map(c => ({
        name: c.name,
        value: c.value,
        domain: c.domain,
        path: c.path,
        expires: c.expires || -1,
        httpOnly: c.httpOnly,
        secure: c.secure,
        sameSite: c.sameSite || 'Lax'
      })),
      origins: []
    };
    
    fs.writeFileSync('C:/Users/Administrator/linuxdo-storage-state-v2.json', JSON.stringify(newState, null, 2));
    console.log('Updated cookies saved to linuxdo-storage-state-v2.json');
  }
  
  // Take screenshot
  await page.screenshot({ path: 'C:/Users/Administrator/linuxdo-final.png', fullPage: true });
  console.log('Screenshot saved to linuxdo-final.png');
  
  // Try to find topics
  const topics = await page.$$eval('.topic-list-item', items => items.length);
  console.log('\nTopic items found:', topics);
  
  await browser.close();
})().catch(e => { console.error('Error:', e.message); process.exit(1); });
