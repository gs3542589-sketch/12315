const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  try {
    // Try to connect to Edge via CDP
    // Edge uses port 9222 by default for remote debugging
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const context = browser.contexts()[0];
    
    // Get all cookies for linux.do
    const cookies = await context.cookies('https://linux.do');
    
    if (cookies.length === 0) {
      console.log('No cookies found for linux.do');
      // Try to navigate to linux.do
      const page = context.pages()[0] || await context.newPage();
      await page.goto('https://linux.do', { timeout: 15000 });
      await page.waitForTimeout(3000);
      const newCookies = await context.cookies('https://linux.do');
      console.log('Cookies after navigation:', newCookies.length);
      if (newCookies.length > 0) {
        saveCookies(newCookies);
      }
    } else {
      console.log('Found', cookies.length, 'cookies for linux.do');
      saveCookies(cookies);
    }
    
    await browser.close();
  } catch (e) {
    console.error('Error:', e.message);
    console.log('\nEdge CDP not available. Trying alternative method...');
    
    // Alternative: launch new browser with Edge executable
    try {
      const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
      if (!fs.existsSync(edgePath)) {
        console.log('Edge not found at default path');
        process.exit(1);
      }
      
      const browser = await chromium.launch({
        executablePath: edgePath,
        headless: false,
        args: ['--remote-debugging-port=9223']
      });
      
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto('https://linux.do', { timeout: 20000 });
      console.log('Please log in to Linux.do in the opened browser window...');
      console.log('Waiting 30 seconds for login...');
      
      await page.waitForTimeout(30000);
      
      const cookies = await context.cookies('https://linux.do');
      console.log('Cookies found:', cookies.length);
      if (cookies.length > 0) {
        saveCookies(cookies);
      }
      
      await browser.close();
    } catch (e2) {
      console.error('Alternative method failed:', e2.message);
      process.exit(1);
    }
  }
})();

function saveCookies(cookies) {
  const sessionCookie = cookies.find(c => c.name === '_session_id' || c.name.includes('session'));
  const cfCookie = cookies.find(c => c.name.includes('cf_clearance'));
  
  console.log('\n=== Linux.do Cookies ===');
  console.log('Total cookies:', cookies.length);
  console.log('Session cookie:', sessionCookie ? 'FOUND' : 'NOT FOUND');
  console.log('CF clearance:', cfCookie ? 'FOUND' : 'NOT FOUND');
  
  // Save to file
  const cookieData = {
    url: 'https://linux.do',
    cookies: cookies,
    extracted: {
      session: sessionCookie?.value,
      cf_clearance: cfCookie?.value
    },
    timestamp: new Date().toISOString()
  };
  
  const savePath = 'C:/Users/Administrator/linuxdo-cookies.json';
  fs.writeFileSync(savePath, JSON.stringify(cookieData, null, 2));
  console.log('\nSaved to:', savePath);
  
  // Also save as Netscape format for curl/wget
  const netscapeCookies = cookies.map(c => {
    const domain = c.domain.startsWith('.') ? c.domain : '.' + c.domain;
    return `${domain}\tTRUE\t${c.path}\t${c.secure ? 'TRUE' : 'FALSE'}\t${Math.floor(c.expires || 0)}\t${c.name}\t${c.value}`;
  }).join('\n');
  
  const netscapePath = 'C:/Users/Administrator/linuxdo-cookies.txt';
  fs.writeFileSync(netscapePath, '# Netscape HTTP Cookie File\n' + netscapeCookies);
  console.log('Netscape format saved to:', netscapePath);
}
