/**
 * 控制豆包搜索三角洲行动数据
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const CONFIG = {
  dataDir: 'C:/Users/Administrator/.qclaw/workspace-agent-1f90a168/data/games'
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function main() {
  ensureDir(CONFIG.dataDir);
  
  console.log('🚀 启动Edge浏览器...');
  
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: false
  });
  
  const page = await browser.newPage();
  console.log('🌐 打开豆包...');
  
  // 使用domcontentloaded代替networkidle
  try {
    await page.goto('https://www.doubao.com', { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('✅ 豆包已打开');
  } catch (e) {
    console.log('⚠️ 豆包加载超时，尝试备用方式...');
    
    // 尝试直接搜索
    const searchUrl = 'https://www.doubao.com/search/?query=%E4%B8%89%E8%A7%92%E6%B4%B2%E8%A1%8C%E5%8A%A8';
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('✅ 已打开搜索页面');
  }
  
  // 等待页面稳定
  await page.waitForTimeout(3000);
  
  // 获取页面内容
  const title = await page.title();
  console.log('📄 页面标题:', title);
  
  // 截图
  const screenshotPath = path.join(CONFIG.dataDir, 'doubao-screenshot.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('📸 截图已保存:', screenshotPath);
  
  // 尝试找到搜索框并搜索
  try {
    console.log('🔍 寻找搜索框...');
    
    // 尝试多种选择器
    const selectors = [
      'input[type="search"]',
      'input[placeholder*="搜索"]',
      '[class*="search-input"]',
      '[class*="SearchInput"]',
      'textarea'
    ];
    
    let searchInput = null;
    for (const selector of selectors) {
      try {
        searchInput = await page.waitForSelector(selector, { timeout: 3000 });
        if (searchInput) {
          console.log(`✅ 找到搜索框: ${selector}`);
          break;
        }
      } catch {}
    }
    
    if (searchInput) {
      await searchInput.fill('三角洲行动');
      console.log('✅ 已输入搜索内容');
      
      await page.keyboard.press('Enter');
      console.log('✅ 已按回车搜索');
      
      await page.waitForTimeout(3000);
      
      const resultPath = path.join(CONFIG.dataDir, 'doubao-search-result.png');
      await page.screenshot({ path: resultPath, fullPage: true });
      console.log('📸 搜索结果截图已保存');
      
      // 提取搜索结果文本
      const content = await page.textContent('body');
      console.log('\n📊 页面内容预览:');
      console.log(content.substring(0, 2000));
    }
    
  } catch (e) {
    console.log('⚠️ 搜索操作失败:', e.message);
  }
  
  // 获取页面HTML用于分析
  const html = await page.content();
  const htmlPath = path.join(CONFIG.dataDir, 'doubao-page.html');
  fs.writeFileSync(htmlPath, html);
  console.log('\n📄 HTML已保存:', htmlPath);
  
  console.log('\n✅ 完成!');
  console.log('浏览器将保持打开状态，你可以继续操作。');
}

main().catch(e => {
  console.error('❌ 错误:', e.message);
  console.error(e.stack);
});
