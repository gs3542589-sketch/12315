const {chromium} = require('playwright');
const fs = require('fs');

(async()=>{
  // Use openclaw's already-logged-in browser via CDP
  const browser = await chromium.connectOverCDP('http://127.0.0.1:28800');
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => p.url().includes('xiaohongshu')) 
    || await ctx.newPage();
  
  // Navigate to xiaohongshu
  await page.goto('https://www.xiaohongshu.com', {timeout: 20000, waitUntil: 'domcontentloaded'});
  await page.waitForTimeout(2000);
  
  // Check login status by checking URL and page content
  const url = page.url();
  console.log('URL:', url);
  const isLoggedIn = !url.includes('login') && !url.includes('(LOGIN_REQUIRED');
  
  // Try to get user info via API
  const cookies = await ctx.cookies('https://www.xiaohongshu.com');
  const webSession = cookies.find(c => c.name === 'web_session');
  console.log('web_session:', webSession ? webSession.value.slice(0,20) + '...' : 'NOT FOUND');
  
  // Check if we can access a profile page
  const response = await page.request.get('https://edith.xiaohongshu.com/api/sns/web/v2/user/me', {
    headers: {
      'Cookie': cookies.map(c => `${c.name}=${c.value}`).join('; '),
      'Referer': 'https://www.xiaohongshu.com'
    }
  });
  console.log('API status:', response.status());
  if (response.ok()) {
    const data = await response.json();
    console.log('User data:', JSON.stringify(data).slice(0, 200));
  }
  
  await browser.close();
  console.log('Cookie verification complete. Logged in:', isLoggedIn);
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
