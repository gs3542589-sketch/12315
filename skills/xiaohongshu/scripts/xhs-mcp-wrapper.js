#!/usr/bin/env node
/**
 * xiaohongshu-mcp Windows stdio wrapper
 * Reads cookies from openclaw browser via Playwright CDP and injects into MCP session
 */
const { chromium } = require('playwright');

async function getCookiesFromBrowser() {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:28800');
    const context = browser.contexts()[0];
    const cookies = await context.cookies('https://www.xiaohongshu.com');
    await browser.close();
    return cookies;
  } catch (e) {
    // Fallback: try to read from saved storage state
    const fs = require('fs');
    const path = require('path');
    const statePath = path.join(process.env.USERPROFILE || '', 'xhs-storage-state.json');
    if (fs.existsSync(statePath)) {
      const state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
      return state.cookies;
    }
    throw e;
  }
}

// Start MCP with cookie injection via stdin/stdout
async function main() {
  // Pass cookies to MCP via environment or inject into the MCP protocol
  const cookies = await getCookiesFromBrowser();
  const webSession = cookies.find(c => c.name === 'web_session');
  
  if (!webSession) {
    console.error('[xhs-mcp] ERROR: web_session cookie not found. Please log in to Xiaohongshu in the browser.');
    process.exit(1);
  }
  
  // Set cookie as env var for the MCP process
  process.env.XHS_WEB_SESSION = webSession.value;
  
  // Spawn the actual MCP process
  const { spawn } = require('child_process');
  const cliPath = require.resolve('xiaohongshu-mcp/cli.js');
  const mcp = spawn('node', [cliPath, '--headless'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  // Proxy MCP JSON-RPC between stdin/stdout
  mcp.stdout.pipe(process.stdout);
  process.stdin.pipe(mcp.stdin);
  mcp.stderr.pipe(process.stderr);
  
  mcp.on('exit', code => process.exit(code || 0));
}

main().catch(e => {
  console.error('[xhs-mcp] Fatal:', e.message);
  process.exit(1);
});
