const { chromium } = require('playwright');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== Linux.do Cookie 手动输入助手 ===\n');
console.log('请在 Edge 浏览器中：');
console.log('1. 按 F12 打开开发者工具');
console.log('2. 点击 Console 标签');
console.log('3. 粘贴以下代码并按回车：\n');
console.log('document.cookie.split("; ").map(c => c.split("=")[0]).join("\n")');
console.log('\n然后复制输出的 cookie 名称列表给我。\n');
console.log('或者直接告诉我 _session_id 的值。\n');

rl.question('请输入 _session_id 的值（或完整的 cookie 字符串）：', (answer) => {
  if (answer.trim()) {
    const cookieData = {
      source: 'user_input',
      timestamp: new Date().toISOString(),
      raw_input: answer.trim(),
      cookies: []
    };
    
    // Try to parse as cookie string
    if (answer.includes('=')) {
      const pairs = answer.split(';').map(p => p.trim());
      pairs.forEach(pair => {
        const [name, ...valueParts] = pair.split('=');
        if (name && valueParts.length > 0) {
          cookieData.cookies.push({
            name: name.trim(),
            value: valueParts.join('=').trim(),
            domain: '.linux.do',
            path: '/'
          });
        }
      });
    }
    
    fs.writeFileSync('C:/Users/Administrator/linuxdo-cookies-user.json', JSON.stringify(cookieData, null, 2));
    console.log('\n✅ 已保存到 linuxdo-cookies-user.json');
    console.log('Cookie 数量:', cookieData.cookies.length);
  } else {
    console.log('未收到输入');
  }
  
  rl.close();
});
