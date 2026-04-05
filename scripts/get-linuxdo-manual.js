const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  console.log('Launching Edge with visible window...');
  console.log('Please check if you are logged in to linux.do');
  console.log('Press Ctrl+C when done to save cookies\n');
  
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: false,
    args: ['--no-sandbox', '--window-size=1280,900']
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://linux.do', { timeout: 60000 });
  
  console.log('Page loaded. Current URL:', page.url());
  
  // Check page content for login indicators
  const content = await page.content();
  const hasLoginButton = content.includes('登录') || content.includes('Login') || content.includes('Sign in');
  const hasUserMenu = content.includes('user-menu') || content.includes('avatar') || content.includes('notifications');
  
  console.log('Login button found:', hasLoginButton);
  console.log('User menu indicators found:', hasUserMenu);
  
  // Wait for user to log in manually
  console.log('\nIf not logged in, please log in now.');
  console.log('Waiting 60 seconds...');
  
  await page.waitForTimeout(60000);
  
  // Get cookies again
  const cookies = await context.cookies('https://linux.do');
  console.log('\n=== Final Cookies ===');
  console.log('Total:', cookies.length);
  
  cookies.forEach(c => {
    const val = c.value.length > 50 ? c.value.slice(0, 50) + '...' : c.value;
    console.log(`${c.name}: ${val}`);
  });
  
  // Check for session
  const sessionNames = ['_session_id', '_t', 'auth_token', 'remember_user_token', 'user_session'];
  const foundSession = cookies.find(c => sessionNames.includes(c.name) || c.name.includes('session'));
  
  if (foundSession) {
    console.log(`\n✅ Session cookie found: ${foundSession.name}`);
  } else {
    console.log('\n⚠️ No standard session cookie found');
    console.log('Available cookies:', cookies.map(c => c.name).join(', '));
  }
  
  // Save all cookies
  fs.writeFileSync('C:/Users/Administrator/linuxdo-cookies-manual.json', JSON.stringify(cookies, null, 2));
  console.log('\nSaved to linuxdo-cookies-manual.json');
  
  await browser.close();
})().catch(e => { console.error('Error:', e.message); process.exit(1); });
