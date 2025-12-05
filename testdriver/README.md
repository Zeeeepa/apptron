# Testing Apptron Chrome Extension with TestDriver

This directory contains automated tests for the Apptron Chrome extension using TestDriver.ai.

## Prerequisites

1. **TestDriver CLI** - Install from https://github.com/Zeeeepa/cli
   ```bash
   git clone https://github.com/Zeeeepa/cli.git
   cd cli/testdriver-proxy
   npm install
   npm link  # Makes 'testui' command available globally
   ```

2. **Z.ai API Key** (Free)
   ```bash
   # Sign up at https://z.ai and get your API key
   export ANTHROPIC_API_KEY="your-zai-api-key"
   
   # Add to shell profile for persistence
   echo 'export ANTHROPIC_API_KEY="your-key"' >> ~/.bashrc
   source ~/.bashrc
   ```

3. **Set GitHub Workspace** (for extension path)
   ```bash
   export GITHUB_WORKSPACE="/path/to/apptron"
   ```

## Running the Tests

### Method 1: Using testui command (Recommended)

```bash
# From the apptron repository root
cd testdriver
testui TEST="test-extension.yaml"
```

### Method 2: Using npm run execute

```bash
# From cli/testdriver-proxy directory
cd /path/to/cli/testdriver-proxy
npm run execute "test the apptron extension on github.com/vercel/next.js"
```

## What the Test Does

1. **Launches Chrome** with the Apptron extension loaded (`lifecycle/prerun.yaml`)
2. **Visits GitHub** repository (vercel/next.js)
3. **Looks for the button** - "Deploy to Apptron"
4. **Clicks the button** if found
5. **Verifies** the button shows loading state
6. **Checks** if config page opens in new tab
7. **Validates** environment variables are detected
8. **Screenshots** every step for debugging

## Expected Behavior

✅ **Button appears** next to branch selector on GitHub
✅ **Button click** triggers "Analyzing project..." loading state
✅ **Config page** opens in new tab
✅ **Repository info** displays correctly (vercel/next.js)
✅ **Environment variables** are detected from .env files
✅ **Form renders** with type-appropriate inputs
✅ **Deploy button** is present and clickable

## Test Artifacts

After running, screenshots will be saved:
- `01-github-loaded.png` - Initial GitHub page
- `02-looking-for-button.png` - Button search area
- `03-after-button-click.png` - After clicking button
- `04-config-page.png` - Configuration page opened
- `05-environment-variables.png` - Detected variables
- `06-final-config-page.png` - Complete config form
- `07-final-summary.png` - Final test state

## Debugging

If tests fail:

1. **Check extension path**
   ```powershell
   # In prerun.yaml, this path is used:
   $extensionPath = Join-Path "${env:GITHUB_WORKSPACE}" "extension"
   
   # Make sure GITHUB_WORKSPACE is set correctly
   ```

2. **Validate extension files exist**
   ```bash
   ls -la extension/
   # Should show: manifest.json, background.js, content-script.js, etc.
   ```

3. **Check Chrome console**
   - Open Chrome DevTools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed API requests

4. **View prerun logs**
   - TestDriver shows prerun execution logs
   - Look for "Extension validation passed" message

## Configuration

### Chrome Arguments (`lifecycle/prerun.yaml`)

The extension is loaded with these Chrome flags:
```powershell
"--load-extension=$extensionPath"    # Load unpacked extension
"--user-data-dir=$profilePath"       # Isolated profile
"--no-first-run"                     # Skip first-run dialogs
"--disable-infobars"                 # Hide automation bar
```

### Environment Variables

Tests use these environment variables:
- `ANTHROPIC_API_KEY` - Z.ai API key for TestDriver
- `GITHUB_WORKSPACE` - Path to apptron repository
- `TD_WEBSITE` - URL to test (set by TestDriver)

## Common Issues

### Issue: "Extension not found"
**Solution:** Set GITHUB_WORKSPACE environment variable

### Issue: "Button not appearing"
**Possible causes:**
1. GitHub DOM changed (selector needs update)
2. Content script didn't load
3. Extension not properly loaded

**Debug:** Check `content-script.js` for selector:
```javascript
const refSelector = document.querySelector('[data-testid="ref-selector-hotkey-button"]');
```

### Issue: "Config page doesn't open"
**Possible causes:**
1. Button click handler not working
2. Chrome extension permissions issue
3. Background script error

**Debug:** Check Chrome console in both tabs

### Issue: "No environment variables detected"
**Possible causes:**
1. GitHub API rate limit
2. Repository doesn't have .env.example
3. Parser error

**Debug:** Check `lib/env-parser.js` logic

## Test on Different Repositories

You can test the extension on other GitHub repos:

```yaml
# Edit test-extension.yaml
url: "https://github.com/facebook/react"
```

Or create a new test file:

```yaml
name: "Test on React Repository"
url: "https://github.com/facebook/react"
steps:
  - prompt: "Follow the same steps as test-extension.yaml"
```

## Contributing

If you find issues with the tests:
1. Check the screenshots in artifacts
2. Review Chrome console errors
3. Update test steps as needed
4. Submit a PR with fixes

## License

MIT

