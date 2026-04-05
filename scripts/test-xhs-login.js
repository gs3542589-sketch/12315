const {chromium} = require('playwright');
const fs = require('fs');

(async()=>{
  const state = JSON.parse(fs.readFileSync('C:/Users/Administrator/xhs-storage-state.json','utf-8'));
  const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
  const ctx = await browser.newContext({storageState:state});
  const page = await ctx.newPage();
  await page.goto('https://www.xiaohongshu.com',{timeout:15000});
  await page.waitForTimeout(3000);
  const url = page.url();
  console.log('Current URL:',url);
  const title = await page.title();
  console.log('Title:',title);
  const loggedIn = !url.includes('login');
  console.log('Logged in:', loggedIn);
  await browser.close();
  console.log('Test OK');
})().catch(e=>{console.error('ERROR:',e.message);process.exit(1);});
