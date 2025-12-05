# 📦 Apptron Runner - Installation Guide

This guide will help you install and set up the Apptron Runner Chrome extension.

## 🚀 Quick Install (5 minutes)

### Prerequisites
- Google Chrome browser (version 88 or later)
- That's it! No other dependencies required

### Step 1: Download the Extension

**Option A: Clone from GitHub**
```bash
git clone https://github.com/tractordev/apptron.git
cd apptron/extension
```

**Option B: Download ZIP**
1. Go to https://github.com/tractordev/apptron
2. Click "Code" → "Download ZIP"
3. Extract the ZIP file
4. Navigate to the `extension` folder

### Step 2: Load in Chrome

1. **Open Chrome Extensions page**
   - Type `chrome://extensions/` in address bar, OR
   - Click ⋮ menu → More Tools → Extensions

2. **Enable Developer Mode**
   - Look for toggle in top-right corner
   - Switch it ON

3. **Load the extension**
   - Click "Load unpacked" button
   - Select the `extension` folder
   - Click "Select Folder"

4. **Verify installation**
   - You should see "Apptron Runner" in your extensions list
   - The extension icon should appear in your toolbar

### Step 3: Test It Out

1. Visit any GitHub repository:
   - Example: https://github.com/facebook/react

2. Look for the "Run in Browser" button:
   - Should appear next to the green "Code" button
   - Purple gradient styling

3. Click it!
   - A new tab will open with Apptron
   - Your first development environment is starting

🎉 **Congratulations!** You're all set!

---

## 🔧 Troubleshooting

### Button doesn't appear on GitHub

**Solution 1: Refresh the page**
- Press `Ctrl+R` (Windows/Linux) or `Cmd+R` (Mac)
- Extension content scripts load on page load

**Solution 2: Check extension is enabled**
- Go to `chrome://extensions/`
- Ensure "Apptron Runner" toggle is ON
- Check that it has permission for `github.com`

**Solution 3: Clear cache and reload extension**
```
1. Go to chrome://extensions/
2. Click "Remove" on Apptron Runner
3. Click "Load unpacked" again
4. Select the extension folder
```

### Extension icon shows error

**Problem**: Service worker not registered

**Solution**:
```
1. Go to chrome://extensions/
2. Click "Details" on Apptron Runner
3. Click "Errors" to see specific error
4. Check console for details
```

### "Run in Browser" button doesn't work

**Symptoms**: Button appears but clicking does nothing

**Solution**:
1. Open browser console (`F12`)
2. Look for JavaScript errors
3. Check that `background.js` is running:
   - Go to `chrome://extensions/`
   - Click "Service worker" next to "Inspect views"
   - Should open a console window

### Apptron doesn't load after clicking

**Symptoms**: Tab opens but shows blank page

**Possible causes**:
1. **Network issue** - Check internet connection
2. **Apptron service down** - Try https://apptron.dev/ directly
3. **Browser cache** - Clear cache and try again

**Solution**:
```bash
# Clear Chrome cache
1. Press Ctrl+Shift+Delete
2. Select "Cached images and files"
3. Click "Clear data"
```

---

## 🔐 Permissions Explained

The extension requests these permissions:

| Permission | Why We Need It | What It Does |
|-----------|----------------|--------------|
| **activeTab** | Access current GitHub page | Read repository information |
| **storage** | Save session data | Track active development sessions |
| **tabs** | Open Apptron tabs | Launch new development environments |
| **github.com** | Inject button | Add "Run in Browser" to repo pages |
| **apptron.dev** | Connect to service | Communicate with Apptron VM |

**Privacy Note**: This extension:
- ✅ Only runs on GitHub repository pages
- ✅ Does NOT collect personal data
- ✅ Does NOT track browsing history
- ✅ Does NOT send data to third parties
- ✅ Processes everything locally in your browser

---

## ⚙️ Advanced Setup

### Custom Apptron Instance

If you're running your own Apptron instance:

1. Open `extension/background.js`
2. Find this line:
   ```javascript
   const apptronUrl = `https://apptron.dev/?` + ...
   ```
3. Change to your instance URL:
   ```javascript
   const apptronUrl = `https://your-instance.com/?` + ...
   ```
4. Reload the extension

### Development Mode

To work on the extension itself:

```bash
# Clone repo
git clone https://github.com/tractordev/apptron.git
cd apptron/extension

# Make changes
# (edit files in your favorite editor)

# Reload extension
# Go to chrome://extensions/ and click the reload icon
```

**Hot Reload Tip**: Install "Extensions Reloader" extension for one-click reload.

---

## 🌐 Browser Compatibility

| Browser | Status | Notes |
|---------|--------|-------|
| **Chrome** | ✅ Fully Supported | Recommended |
| **Edge** | ✅ Fully Supported | Chromium-based |
| **Brave** | ✅ Fully Supported | Chromium-based |
| **Opera** | ✅ Fully Supported | Chromium-based |
| **Firefox** | ⚠️ Not Yet | Manifest V3 differences |
| **Safari** | ❌ Not Supported | Different extension format |

**Note**: Any Chromium-based browser should work. Firefox support coming soon!

---

## 📊 Verify Installation

### Check Extension Is Loaded
```
1. Go to chrome://extensions/
2. Find "Apptron Runner"
3. Status should be "ON" (blue toggle)
4. No errors should be shown
```

### Check Permissions Are Granted
```
1. Go to chrome://extensions/
2. Click "Details" on Apptron Runner
3. Scroll to "Site access"
4. Should show "On specific sites"
5. Should list "github.com" and "apptron.dev"
```

### Test Core Functionality
```bash
# Test 1: Button appears
Visit: https://github.com/facebook/react
Expected: Purple "Run in Browser" button visible

# Test 2: Extension popup works
Click: Extension icon in toolbar
Expected: Popup shows "No active sessions"

# Test 3: Button launches Apptron
Click: "Run in Browser" on any repo
Expected: New tab opens with Apptron

# Test 4: Session tracked
After: Clicking "Run in Browser"
Click: Extension icon
Expected: Session shows in popup
```

✅ If all tests pass, you're good to go!

---

## 🆘 Getting Help

### Documentation
- 📖 **README**: [extension/README.md](./README.md)
- 🏗️ **Architecture**: [extension/ARCHITECTURE.md](./ARCHITECTURE.md)
- 🐛 **Known Issues**: [extension/README.md#known-issues](./README.md#known-issues)

### Community
- 💬 **GitHub Issues**: https://github.com/tractordev/apptron/issues
- 🐦 **Twitter**: [@progrium](https://twitter.com/progrium)
- 📧 **Email**: support@apptron.dev

### Report a Bug
```
1. Go to: https://github.com/tractordev/apptron/issues/new
2. Title: "[Extension] Brief description"
3. Include:
   - Chrome version (chrome://version/)
   - Extension version (chrome://extensions/)
   - Steps to reproduce
   - Screenshots if relevant
   - Console errors (F12 → Console)
```

---

## 🚀 Next Steps

Now that you're installed:

1. **Try it out** - Visit some repos and run them
2. **Star the repo** - Help us grow! ⭐
3. **Share** - Tell your friends about Apptron
4. **Contribute** - Found a bug? Have an idea? PR welcome!

---

**Happy coding! 🎉**

