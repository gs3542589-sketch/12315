const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  console.log('Launching Edge...');
  
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: false,
    args: ['--no-sandbox', '--window-size=1400,900']
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Step 1: Open Edge extensions store
  console.log('Opening Edge extensions store...');
  await page.goto('https://microsoftedge.microsoft.com/addons/detail/cookieeditor/neaplmfkghagebokkhpjpoebhdledlfi', { 
    timeout: 60000,
    waitUntil: 'domcontentloaded'
  });
  
  console.log('Cookie-Editor page loaded');
  console.log('Please click the "Get" or "Add to Chrome" button to install the extension');
  console.log('Then open linux.do and use the extension to export cookies');
  console.log('\nWaiting 2 minutes for you to complete...');
  
  await page.waitForTimeout(120000);
  
  console.log('Time is up. Checking for cookies...');
  
  // Try to get cookies from linux.do
  const cookies = await context.cookies('https://linux.do');
  console.log('Cookies found:', cookies.length);
  
  if (cookies.length > 0) {
    fs.writeFileSync('C:/Users/Administrator/linuxdo-cookies-export.json', JSON.stringify(cookies, null, 2));
    console.log('Saved to linuxdo-cookies-export.json');
    
    cookies.forEach(c => {
      console.log(`- ${c.name}: ${c.value.slice(0, 50)}...`);
    });
  }
  
  await browser.close();
})().catch(e => { console.error('Error:', e.message); process.exit(1); });
