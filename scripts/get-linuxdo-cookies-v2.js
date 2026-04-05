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
  
  console.log('Navigating to linux.do (domcontentloaded)...');
  await page.goto('https://linux.do', { timeout: 30000, waitUntil: 'domcontentloaded' });
  
  console.log('Current URL:', page.url());
  console.log('Waiting 10 seconds...');
  await page.waitForTimeout(10000);
  
  const cookies = await context.cookies('https://linux.do');
  console.log('\n=== Cookies found ===');
  console.log('Total:', cookies.length);
  
  cookies.forEach(c => {
    const val = c.value.length > 60 ? c.value.slice(0, 60) + '...' : c.value;
    console.log(`${c.name}: ${val}`);
  });
  
  // Check for session cookie
  const session = cookies.find(c => c.name === '_session_id' || c.name.includes('session'));
  const cf = cookies.find(c => c.name === 'cf_clearance');
  
  if (session) {
    console.log('\n✅ Session cookie found!');
  } else {
    console.log('\n⚠️ No session cookie found.');
  }
  
  if (cf) {
    console.log('✅ CF clearance found!');
  }
  
  fs.writeFileSync('C:/Users/Administrator/linuxdo-cookies-final.json', JSON.stringify(cookies, null, 2));
  console.log('\nSaved to linuxdo-cookies-final.json');
  
  // Also save in Netscape format
  const netscape = cookies.map(c => {
    const domain = c.domain.startsWith('.') ? c.domain : '.' + c.domain;
    const expires = c.expires && c.expires > 0 ? Math.floor(c.expires) : 0;
    return `${domain}\tTRUE\t${c.path}\t${c.secure ? 'TRUE' : 'FALSE'}\t${expires}\t${c.name}\t${c.value}`;
  }).join('\n');
  fs.writeFileSync('C:/Users/Administrator/linuxdo-cookies.txt', '# Netscape HTTP Cookie File\n' + netscape);
  console.log('Netscape format saved to linuxdo-cookies.txt');
  
  await browser.close();
})().catch(e => { console.error('Error:', e.message); process.exit(1); });
