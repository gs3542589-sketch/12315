const {chromium} = require('playwright');

(async()=>{
  // Connect to already-logged-in openclaw browser
  const browser = await chromium.connectOverCDP('http://127.0.0.1:28800');
  const ctx = browser.contexts()[0];
  let page = ctx.pages().find(p => p.url().includes('69abcb45000000001d024192'));
  
  if (!page) {
    page = await ctx.newPage();
    await page.goto('https://www.xiaohongshu.com/explore/69abcb45000000001d024192', {
      timeout: 20000, waitUntil: 'networkidle'
    });
  }
  
  // Wait for content to load
  await page.waitForTimeout(3000);
  
  // Try to extract note content via JS
  const result = await page.evaluate(() => {
    const title = document.querySelector('h1')?.innerText || document.title;
    const content = document.querySelector('#detail-desc')?.innerText || 
                    document.querySelector('.note-content')?.innerText ||
                    document.querySelector('[data-v-b09d3d92]')?.innerText ||
                    '';
    const author = document.querySelector('.author-wrapper')?.innerText ||
                  document.querySelector('[data-v-6f14e3d4]')?.innerText || '';
    
    // Try to find the main content area
    const allText = [];
    document.querySelectorAll('p, span, div').forEach(el => {
      const text = el.innerText?.trim();
      if (text && text.length > 10 && text.length < 2000) {
        allText.push(text);
      }
    });
    
    return { title, content, author, sampleText: allText.slice(0, 20) };
  });
  
  console.log('Title:', result.title);
  console.log('Author area:', result.author.slice(0, 100));
  console.log('Content:', result.content.slice(0, 500));
  console.log('Sample texts:', JSON.stringify(result.sampleText.slice(0,10), null, 2));
  console.log('URL:', page.url());
  
  // Check if we're logged in
  const cookies = await ctx.cookies('https://www.xiaohongshu.com');
  const ws = cookies.find(c => c.name === 'web_session');
  console.log('web_session:', ws ? 'FOUND (' + ws.value.slice(0,15) + '...)' : 'MISSING');
  
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
