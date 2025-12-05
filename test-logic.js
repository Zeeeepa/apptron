// Test the actual logic without Chrome APIs
const fs = require('fs');

console.log('🧪 TESTING EXTENSION LOGIC\n');

// Load the content script
const contentScript = fs.readFileSync('./extension/content-script.js', 'utf8');

// Mock browser environment
global.window = {
  location: {
    pathname: '/facebook/react',
    href: 'https://github.com/facebook/react'
  }
};

global.document = {
  querySelector: (selector) => {
    const mocks = {
      '[data-testid="get-repo-select-menu"]': { appendChild: () => {} },
      '[data-hotkey="w"] span': { textContent: 'main' },
      '[itemprop="programmingLanguage"]': { textContent: 'JavaScript' }
    };
    return mocks[selector] || null;
  },
  querySelectorAll: (selector) => {
    if (selector === '[role="rowheader"]') {
      return [
        { textContent: 'package.json' },
        { textContent: 'README.md' },
        { textContent: 'tsconfig.json' }
      ];
    }
    return [];
  },
  createElement: (tag) => ({
    classList: { add: () => {} },
    addEventListener: () => {},
    innerHTML: '',
    textContent: ''
  })
};

global.chrome = {
  runtime: {
    sendMessage: (msg) => {
      console.log('✅ chrome.runtime.sendMessage called with:', JSON.stringify(msg, null, 2));
    }
  }
};

try {
  // Execute the content script
  eval(contentScript);
  console.log('\n✅ Content script executed without errors');
  console.log('✅ If this were a real browser, the button would be injected');
} catch (e) {
  console.log('\n❌ ERROR:', e.message);
  console.log('❌ Stack:', e.stack);
}
