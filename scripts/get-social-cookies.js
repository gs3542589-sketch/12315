/**
 * 社交媒体Cookie获取工具
 * 帮助获取各平台的登录Cookie
 * 
 * 使用方式:
 *   node get-social-cookies.js <platform>
 * 
 * 支持平台: douyin, xhs, weibo, bilibili, zhihu
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  cookieDir: 'C:/Users/Administrator',
  platforms: {
    douyin: {
      name: '抖音创作者平台',
      url: 'https://creator.douyin.com/creator-micro/home',
      exportPath: 'douyin-cookie.json'
    },
    xhs: {
      name: '小红书',
      url: 'https://www.xiaohongshu.com/explore',
      exportPath: 'xhs-cookie.json'
    },
    weibo: {
      name: '微博',
      url: 'https://weibo.com',
      exportPath: 'weibo-cookie.json'
    },
    bilibili: {
      name: 'B站',
      url: 'https://www.bilibili.com',
      exportPath: 'bilibili-cookie.json'
    },
    zhihu: {
      name: '知乎',
      url: 'https://www.zhihu.com',
      exportPath: 'zhihu-cookie.json'
    }
  }
};

async function getCookies(platform) {
  const config = CONFIG.platforms[platform];
  
  if (!config) {
    console.log(`❌ Unknown platform: ${platform}`);
    console.log('Available:', Object.keys(CONFIG.platforms).join(', '));
    return;
  }
  
  console.log(`\n📱 ${config.name} Cookie获取工具`);
  console.log('='.repeat(40));
  console.log(`目标URL: ${config.url}`);
  console.log('保存位置:', path.join(CONFIG.cookieDir, config.exportPath));
  console.log();
  
  const browser = await chromium.launch({
    headless: false, // 需要可见浏览器以便登录
    args: ['--start-maximized']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    locale: 'zh-CN'
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🌐 正在打开浏览器...');
    await page.goto(config.url, { waitUntil: 'networkidle', timeout: 60000 });
    
    console.log('✅ 页面已加载');
    console.log('📋 请手动登录您的账号...');
    console.log('⏸️  登录完成后，按 Enter 继续...');
    
    // 等待用户按Enter
    await new Promise(resolve => {
      process.stdin.once('data', () => resolve());
    });
    
    console.log('💾 正在保存Cookie...');
    
    const cookies = await context.cookies();
    const storageState = await context.storageState();
    
    const exportPath = path.join(CONFIG.cookieDir, config.exportPath);
    fs.writeFileSync(exportPath, JSON.stringify(storageState, null, 2));
    
    console.log(`✅ Cookie已保存: ${exportPath}`);
    console.log(`📊 共 ${cookies.length} 个Cookie`);
    
    // 显示关键Cookie名称
    const importantCookies = cookies.filter(c => 
      ['session', 'token', 'sid', 'uid', 'uuid', 'bfw', 'SUB'].includes(c.name.split('_')[0])
    );
    
    if (importantCookies.length > 0) {
      console.log('🔑 关键Cookie:');
      importantCookies.forEach(c => console.log(`   - ${c.name}`));
    }
    
  } catch (e) {
    console.error('❌ Error:', e.message);
  } finally {
    await browser.close();
  }
}

// 自动检测登录状态
async function checkLogin(platform) {
  const config = CONFIG.platforms[platform];
  if (!config) return false;
  
  const cookiePath = path.join(CONFIG.cookieDir, config.exportPath);
  if (!fs.existsSync(cookiePath)) return false;
  
  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      storageState: cookiePath
    });
    
    const page = await context.newPage();
    await page.goto(config.url, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(2000);
    
    // 检查是否登录
    const isLoggedIn = await page.evaluate(() => {
      // 根据各平台特点判断
      const body = document.body.innerHTML;
      return !body.includes('登录') && !body.includes('login');
    });
    
    await browser.close();
    return isLoggedIn;
  } catch {
    return false;
  }
}

async function main() {
  const platform = process.argv[2];
  
  if (!platform) {
    console.log(`
🍪 社交媒体Cookie获取工具

用法: node get-social-cookies.js <platform>

支持的平台:
  douyin  - 抖音创作者平台
  xhs     - 小红书
  weibo   - 微博
  bilibili - B站
  zhihu   - 知乎

Cookie保存位置:
  ${CONFIG.cookieDir}/<platform>-cookie.json

示例:
  node get-social-cookies.js douyin
  node get-social-cookies.js xhs
`);
    
    // 检查现有Cookie状态
    console.log('\n📊 当前Cookie状态:');
    for (const [key, config] of Object.entries(CONFIG.platforms)) {
      const cookiePath = path.join(CONFIG.cookieDir, config.exportPath);
      const exists = fs.existsSync(cookiePath);
      const status = exists ? '⚠️ 已存在' : '❌ 未获取';
      console.log(`   ${key.padEnd(10)} ${status} (${config.name})`);
    }
    return;
  }
  
  if (platform === 'check') {
    console.log('📊 Cookie有效性检查:');
    for (const key of Object.keys(CONFIG.platforms)) {
      const valid = await checkLogin(key);
      console.log(`   ${key.padEnd(10)} ${valid ? '✅ 有效' : '❌ 无效'}`);
    }
    return;
  }
  
  await getCookies(platform);
}

main().catch(console.error);
