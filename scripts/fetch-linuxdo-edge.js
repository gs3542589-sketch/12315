const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const edgeUserData = 'C:\\Users\\Administrator\\AppData\\Local\\Microsoft\\Edge\\User Data';
  
  if (!fs.existsSync(edgeUserData)) {
    console.log('Edge user data not found');
    process.exit(1);
  }
  
  console.log('Edge user data found:', edgeUserData);
  
  const browser = await chromium.launchPersistentContext(edgeUserData, {
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });
  
  const page = browser.pages()[0] || await browser.newPage();
  await page.goto('https://linux.do', { timeout: 20000 });
  await page.waitForTimeout(3000);
  
  const cookies = await browser.cookies('https://linux.do');
  console.log('Cookies found:', cookies.length);
  
  const sessionCookie = cookies.find(c => c.name === '_session_id' || c.name.includes('session'));
  console.log('Session cookie:', sessionCookie ? sessionCookie.name : 'NOT FOUND');
  
  if (sessionCookie) {
    console.log('Session value:', sessionCookie.value.slice(0, 50) + '...');
  }
  
  fs.writeFileSync('C:/Users/Administrator/linuxdo-cookies-v2.json', JSON.stringify(cookies, null, 2));
  console.log('Saved to linuxdo-cookies-v2.json');
  
  await browser.close();
})().catch(e => { console.error('Error:', e.message); });
