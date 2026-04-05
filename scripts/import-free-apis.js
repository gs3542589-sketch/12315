const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const FREE_API_DIR = 'C:/Users/Administrator/.qclaw/workspace-agent-1f90a168/data/linuxdo';
const PROVIDERS_FILE = path.join(FREE_API_DIR, 'free-api-providers.json');
const QCLAW_CONFIG = 'C:/Users/Administrator/.qclaw/openclaw.json';

function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

async function importProviders() {
  log('=== Import Free API Providers to QClaw ===\n');
  
  // Check if providers file exists
  if (!fs.existsSync(PROVIDERS_FILE)) {
    log('❌ No providers file found. Run linuxdo-free-api-scraper.js first.');
    return;
  }
  
  // Read generated providers
  const providers = JSON.parse(fs.readFileSync(PROVIDERS_FILE, 'utf-8'));
  const providerCount = Object.keys(providers).length;
  
  if (providerCount === 0) {
    log('⚠️ No providers to import.');
    return;
  }
  
  log(`Found ${providerCount} providers to import`);
  
  // Read current config
  const config = JSON.parse(fs.readFileSync(QCLAW_CONFIG, 'utf-8'));
  
  // Backup config
  const backupPath = `${QCLAW_CONFIG}.backup-${Date.now()}`;
  fs.writeFileSync(backupPath, JSON.stringify(config, null, 2));
  log(`Config backed up to: ${backupPath}`);
  
  // Merge providers
  if (!config.models) config.models = {};
  if (!config.models.providers) config.models.providers = {};
  
  let imported = 0;
  for (const [name, provider] of Object.entries(providers)) {
    // Skip if already exists with same baseUrl
    const exists = Object.values(config.models.providers).some(
      p => p.baseUrl === provider.baseUrl
    );
    
    if (!exists) {
      config.models.providers[name] = provider;
      log(`✅ Imported: ${name} (${provider.baseUrl})`);
      imported++;
    } else {
      log(`⏭️ Skipped (exists): ${name}`);
    }
  }
  
  // Save updated config
  fs.writeFileSync(QCLAW_CONFIG, JSON.stringify(config, null, 2));
  log(`\n✅ Config updated! Imported ${imported} new providers.`);
  
  // Create summary
  const summary = {
    importedAt: new Date().toISOString(),
    totalProviders: providerCount,
    newImported: imported,
    providers: Object.keys(providers)
  };
  
  const summaryFile = path.join(FREE_API_DIR, 'import-summary.json');
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
  
  log(`\n📋 Summary saved to: ${summaryFile}`);
  log('\n⚠️ Note: You may need to set API keys via environment variables:');
  Object.keys(providers).forEach(name => {
    log(`  - ${name.toUpperCase().replace(/-/g, '_')}_API_KEY`);
  });
}

importProviders().catch(error => {
  log(`❌ Error: ${error.message}`);
  process.exit(1);
});
