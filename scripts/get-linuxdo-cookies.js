const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  console.log('Launching Edge...');
  
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: false,
    args: ['--no-sandbox']
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to linux.do...');
  await page.goto('https://linux.do', { timeout: 30000, waitUntil: 'networkidle' });
  
  console.log('Current URL:', page.url());
  console.log('Waiting 5 seconds for page to settle...');
  await page.waitForTimeout(5000);
  
  const cookies = await context.cookies('https://linux.do');
  console.log('\n=== Cookies found ===');
  console.log('Total:', cookies.length);
  
  cookies.forEach(c => {
    console.log(`${c.name}: ${c.value.slice(0, 60)}...`);
  });
  
  // Check for session cookie
  const session = cookies.find(c => c.name === '_session_id' || c.name.includes('session'));
  if (session) {
    console.log('\n✅ Session cookie found!');
  } else {
    console.log('\n⚠️ No session cookie found. You may need to log in manually.');
    console.log('Waiting 30 seconds for manual login...');
    await page.waitForTimeout(30000);
    
    // Check again
    const cookies2 = await context.cookies('https://linux.do');
    const session2 = cookies2.find(c => c.name === '_session_id' || c.name.includes('session'));
    if (session2) {
      console.log('✅ Session cookie found after wait!');
      fs.writeFileSync('C:/Users/Administrator/linuxdo-cookies-final.json', JSON.stringify(cookies2, null, 2));
    } else {
      console.log('❌ Still no session cookie. Please check if you are logged in.');
    }
  }
  
  fs.writeFileSync('C:/Users/Administrator/linuxdo-cookies-final.json', JSON.stringify(cookies, null, 2));
  console.log('\nSaved to linuxdo-cookies-final.json');
  
  await browser.close();
})().catch(e => { console.error('Error:', e.message); process.exit(1); });
