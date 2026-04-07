/**
 * 自动化Cookie获取 - 支持扫码登录
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  cookieDir: 'C:/Users/Administrator',
  platforms: {
    weibo: {
      name: '微博',
      url: 'https://weibo.com',
      exportPath: 'weibo-cookie.json'
    },
    bilibili: {
      name: 'B站',
      url: 'https://www.bilibili.com',
      exportPath: 'bilibili-cookie.json'
    }
  }
};

async function getCookies(platform) {
  const config = CONFIG.platforms[platform] || { name: platform, url: `https://www.${platform}.com`, exportPath: `${platform}-cookie.json` };
  
  console.log(`\n========================================`);
  console.log(`🍪 ${config.name} Cookie获取`);
  console.log(`========================================\n`);
  
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized', '--disable-web-security']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai'
  });
  
  const page = await context.newPage();
  
  console.log(`🌐 正在打开 ${config.url}...`);
  await page.goto(config.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  // 检测登录状态
  const isLoginPage = await page.evaluate(() => {
    const html = document.body.innerHTML.toLowerCase();
    return html.includes('登录') || html.includes('login') || html.includes('sign in');
  });
  
  if (isLoginPage) {
    console.log('📱 检测到需要登录，请手动操作...\n');
    console.log('========================================');
    console.log('⏸️  等待登录完成 (最多 120 秒)...');
    console.log('========================================\n');
    
    // 等待用户手动登录，最多120秒
    let waitCount = 0;
    while (waitCount < 120) {
      await page.waitForTimeout(1000);
      waitCount++;
      
      // 每10秒检查一次是否登录成功
      if (waitCount % 10 === 0) {
        const stillLogin = await page.evaluate(() => {
          const html = document.body.innerHTML.toLowerCase();
          return html.includes('登录') && !html.includes('已登录');
        });
        
        if (!stillLogin) {
          console.log('✅ 检测到登录成功！');
          break;
        }
        console.log(`   已等待 ${waitCount} 秒...`);
      }
    }
    
    if (waitCount >= 120) {
      console.log('⚠️ 等待超时，请在浏览器中完成登录后按 Enter');
      await new Promise(r => process.stdin.once('data', r));
    }
  } else {
    console.log('✅ 页面已加载');
  }
  
  // 保存Cookie
  console.log('\n💾 正在保存Cookie...');
  
  const cookies = await context.cookies();
  const storageState = await context.storageState();
  
  const exportPath = path.join(CONFIG.cookieDir, config.exportPath);
  fs.writeFileSync(exportPath, JSON.stringify(storageState, null, 2));
  
  console.log(`✅ 已保存: ${exportPath}`);
  console.log(`📊 共 ${cookies.length} 个Cookie`);
  
  // 显示关键Cookie
  const keyCookies = cookies.filter(c => 
    ['SESSION', 'SSO', 'token', 'uid', 'uuid', 'SUB', 'BDUSS', 'BILI_JCT'].some(k => c.name.toUpperCase().includes(k.toUpperCase()))
  );
  
  if (keyCookies.length > 0) {
    console.log('\n🔑 关键Cookie:');
    keyCookies.forEach(c => console.log(`   ${c.name}`));
  }
  
  await browser.close();
  console.log('\n========================================');
  console.log('✅ 完成！可以运行采集脚本了');
  console.log('========================================\n');
}

async function main() {
  const platform = process.argv[2] || 'weibo';
  
  if (platform === 'all') {
    for (const p of Object.keys(CONFIG.platforms)) {
      await getCookies(p);
    }
  } else {
    await getCookies(platform);
  }
}

main().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
