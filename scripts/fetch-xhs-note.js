const {chromium} = require('playwright');
const fs = require('fs');

(async()=>{
  const state = JSON.parse(fs.readFileSync('C:/Users/Administrator/xhs-storage-state.json','utf-8'));
  const browser = await chromium.launch({headless:true, args:['--no-sandbox','--disable-web-security']});
  const ctx = await browser.newContext({storageState:state});
  const page = await ctx.newPage();
  
  const noteId = '69abcb45000000001d024192';
  const xsecToken = 'ABA0u73HNwvDHBO-hLQRiQCDbFqiGL3PGuDGXzPGVn64Y=';
  
  // Try to get cookies and make API call
  const cookies = await ctx.cookies('https://www.xiaohongshu.com');
  const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');
  
  // Method 1: Try the web API directly
  const apiUrl = `https://edith.xiaohongshu.com/api/sns/web/v1/feed?source_note_id=${noteId}&image_formats=jpg,webp,avif`;
  
  const response = await page.request.get(apiUrl, {
    headers: {
      'Cookie': cookieStr,
      'Referer': 'https://www.xiaohongshu.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Origin': 'https://www.xiaohongshu.com',
    }
  });
  
  console.log('API Status:', response.status());
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2).slice(0, 5000));
  
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message, e.stack); process.exit(1); });
