#!/usr/bin/env node
/**
 * Linux.do 定时抓取执行脚本
 * 由 cron 任务调用，执行实际抓取并发送结果通知
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SCRAPER_SCRIPT = 'C:/Users/Administrator/.qclaw/workspace-agent-1f90a168/scripts/linuxdo-scraper-v2.js';
const OUTPUT_DIR = 'C:/Users/Administrator/.qclaw/workspace-agent-1f90a168/data/linuxdo';
const LATEST_FILE = path.join(OUTPUT_DIR, 'latest.json');

async function main() {
  console.log('=== Linux.do 定时抓取执行 ===');
  console.log('Time:', new Date().toISOString());
  
  try {
    // Run the scraper
    console.log('\n📌 开始执行抓取脚本...');
    execSync(`node "${SCRAPER_SCRIPT}"`, { 
      stdio: 'inherit',
      timeout: 120000
    });
    
    // Read results
    if (fs.existsSync(LATEST_FILE)) {
      const results = JSON.parse(fs.readFileSync(LATEST_FILE, 'utf-8'));
      
      console.log('\n=== 抓取结果 ===');
      console.log('时间:', results.scrapedAt);
      console.log('总帖子数:', results.summary.totalPosts);
      console.log('成功板块:', result.summary.forumsScraped);
      console.log('错误数:', results.summary.errors);
      
      if (results.summary.totalPosts > 0) {
        console.log('\n📋 抓取到的帖子预览：');
        Object.entries(results.forums).forEach(([forum, posts]) => {
          if (posts.length > 0) {
            console.log(`\n【${forum}】${posts.length} 个帖子`);
            posts.slice(0, 3).forEach((post, i) => {
              console.log(`  ${i+1}. ${post.title.slice(0, 50)}... (${post.author})`);
            });
            if (posts.length > 3) {
              console.log(`  ... 还有 ${posts.length - 3} 个帖子`);
            }
          }
        });
      }
      
      if (results.summary.errors > 0) {
        console.log('\n⚠️ 抓取错误：');
        results.errors.forEach(err => {
          console.log(`  - ${err.forum}: ${err.error || '未知错误'}`);
        });
        console.log('\n💡 提示：如果错误是 "cloudflare_challenge"，请手动更新 Cookie');
      }
      
      console.log('\n✅ 抓取完成！');
      console.log('数据保存位置:', OUTPUT_DIR);
    } else {
      console.log('\n⚠️ 未找到抓取结果文件');
    }
    
  } catch (error) {
    console.error('\n❌ 抓取执行失败:', error.message);
    console.log('\n💡 可能原因：');
    console.log('  1. Cloudflare 验证过期，需要更新 Cookie');
    console.log('  2. 网络连接问题');
    console.log('  3. Linux.do 网站结构变化');
    console.log('\n请手动运行测试脚本检查问题。');
    process.exit(1);
  }
}

main();
