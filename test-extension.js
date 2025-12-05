// Node.js script to validate the extension files
const fs = require('fs');
const path = require('path');

console.log('🔍 VALIDATING EXTENSION FILES...\n');

const extensionDir = './extension';
const requiredFiles = [
  'manifest.json',
  'background.js',
  'content-script.js',
  'popup.html',
  'popup.js',
  'styles/content.css',
  'lib/github-parser.js',
  'lib/project-detector.js'
];

let errors = 0;
let warnings = 0;

// Check files exist
console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  const filePath = path.join(extensionDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ MISSING: ${file}`);
    errors++;
  }
});

// Validate manifest.json
console.log('\n📋 Validating manifest.json...');
try {
  const manifest = JSON.parse(fs.readFileSync(path.join(extensionDir, 'manifest.json'), 'utf8'));
  
  if (manifest.manifest_version !== 3) {
    console.log('❌ manifest_version should be 3');
    errors++;
  } else {
    console.log('✅ Manifest V3');
  }
  
  if (!manifest.permissions || !Array.isArray(manifest.permissions)) {
    console.log('❌ Missing or invalid permissions');
    errors++;
  } else {
    console.log(`✅ Permissions: ${manifest.permissions.join(', ')}`);
  }
  
  if (!manifest.host_permissions || !Array.isArray(manifest.host_permissions)) {
    console.log('❌ Missing or invalid host_permissions');
    errors++;
  } else {
    console.log(`✅ Host permissions: ${manifest.host_permissions.length} defined`);
  }
  
  if (!manifest.background || !manifest.background.service_worker) {
    console.log('❌ Missing service_worker in background');
    errors++;
  } else {
    console.log(`✅ Service worker: ${manifest.background.service_worker}`);
  }
  
  if (!manifest.content_scripts || manifest.content_scripts.length === 0) {
    console.log('❌ No content_scripts defined');
    errors++;
  } else {
    console.log(`✅ Content scripts: ${manifest.content_scripts.length} defined`);
  }
  
} catch (e) {
  console.log(`❌ Invalid JSON in manifest.json: ${e.message}`);
  errors++;
}

// Check JavaScript syntax
console.log('\n🔧 Checking JavaScript syntax...');
const jsFiles = [
  'background.js',
  'content-script.js',
  'popup.js',
  'lib/github-parser.js',
  'lib/project-detector.js'
];

jsFiles.forEach(file => {
  const filePath = path.join(extensionDir, file);
  if (fs.existsSync(filePath)) {
    const code = fs.readFileSync(filePath, 'utf8');
    try {
      // Basic syntax check
      new Function(code);
      console.log(`✅ ${file} - syntax OK`);
    } catch (e) {
      console.log(`❌ ${file} - syntax error: ${e.message}`);
      errors++;
    }
  }
});

// Check for Chrome API usage
console.log('\n🔌 Checking Chrome API usage...');
const contentScript = fs.readFileSync(path.join(extensionDir, 'content-script.js'), 'utf8');
if (contentScript.includes('chrome.runtime.sendMessage')) {
  console.log('✅ Uses chrome.runtime.sendMessage');
} else {
  console.log('⚠️  No chrome.runtime.sendMessage found');
  warnings++;
}

const background = fs.readFileSync(path.join(extensionDir, 'background.js'), 'utf8');
if (background.includes('chrome.tabs.create')) {
  console.log('✅ Uses chrome.tabs.create');
} else {
  console.log('❌ No chrome.tabs.create found');
  errors++;
}

// Final report
console.log('\n' + '='.repeat(50));
console.log('📊 VALIDATION REPORT');
console.log('='.repeat(50));
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}`);

if (errors === 0 && warnings === 0) {
  console.log('\n✅ ALL CHECKS PASSED! Extension is ready to test.');
  process.exit(0);
} else if (errors === 0) {
  console.log('\n⚠️  VALIDATION PASSED WITH WARNINGS');
  process.exit(0);
} else {
  console.log('\n❌ VALIDATION FAILED - Fix errors before testing');
  process.exit(1);
}
