# 🧪 **TESTING INSTRUCTIONS - REAL WORLD USAGE**

## ✅ **VALIDATION STATUS: ALL CHECKS PASSED**

The extension code has been validated and all syntax errors have been fixed.

---

## 📦 **STEP 1: INSTALL THE EXTENSION**

### Option A: From This Repository

```bash
# 1. Clone the repository
git clone https://github.com/Zeeeepa/apptron.git
cd apptron

# 2. Checkout the extension branch
git checkout feature/chrome-extension-v1

# 3. Extension files are in: apptron/extension/
```

### Option B: Direct Download

1. Go to: https://github.com/Zeeeepa/apptron/tree/feature/chrome-extension-v1
2. Click "Code" → "Download ZIP"
3. Extract and navigate to the `extension/` folder

---

## 🔧 **STEP 2: LOAD IN CHROME**

1. **Open Chrome Extensions Page**
   - Type `chrome://extensions/` in the address bar
   - Or: Menu → More Tools → Extensions

2. **Enable Developer Mode**
   - Toggle the switch in the **top-right corner**
   - It should turn blue/on

3. **Load the Extension**
   - Click **"Load unpacked"** button
   - Navigate to the `extension/` folder
   - Click **"Select Folder"**

4. **Verify Installation**
   - You should see "Apptron Runner" in your extensions list
   - Status should be **ON** (blue toggle)
   - No errors should be shown

---

## 🎯 **STEP 3: TEST ON REAL GITHUB**

### Test Case 1: Button Appears

1. **Navigate to a GitHub repository**
   ```
   https://github.com/facebook/react
   ```

2. **Look for the button**
   - Should appear next to the green "Code" button
   - Purple gradient styling
   - Text: "Run in Browser"

3. **Expected Result**: ✅ Button is visible

### Test Case 2: Button Click

1. **Click the "Run in Browser" button**

2. **Expected Results**:
   - Button changes to "Opening..." with spinner
   - New tab opens with Apptron
   - URL contains parameters like:
     ```
     https://apptron.dev/?repo=https://github.com/facebook/react&branch=main&lang=JavaScript&type=nodejs
     ```
   - Button changes to "Opened!" briefly
   - Button returns to normal state after 2 seconds

### Test Case 3: Extension Popup

1. **Click the extension icon** in your Chrome toolbar

2. **Expected Results**:
   - Popup window opens
   - Shows "Active Sessions" section
   - If you clicked "Run in Browser", session should be listed
   - Shows repository name and duration
   - Click session to switch to that tab

### Test Case 4: Multiple Repositories

1. **Open multiple GitHub repos in tabs**:
   - https://github.com/vercel/next.js
   - https://github.com/django/django
   - https://github.com/golang/go

2. **For Each**:
   - Verify button appears
   - Click "Run in Browser"
   - Check extension popup shows all sessions

### Test Case 5: Project Detection

1. **Check Console** (F12 → Console tab)
2. **Look for logs** from content script
3. **Expected**: Should detect project types correctly:
   - `package.json` → nodejs
   - `requirements.txt` → python
   - `go.mod` → golang
   - `Cargo.toml` → rust

---

## 🐛 **STEP 4: WHAT TO CHECK IF IT DOESN'T WORK**

### If Button Doesn't Appear:

1. **Refresh the GitHub page** (Ctrl+R / Cmd+R)
2. **Check extension is enabled**:
   - Go to `chrome://extensions/`
   - Verify "Apptron Runner" toggle is ON
3. **Check for errors**:
   - Open DevTools (F12)
   - Check Console for red errors
4. **Verify you're on a repository page**:
   - URL should be: `https://github.com/OWNER/REPO`
   - Not on: `/search`, `/explore`, `/trending`, etc.

### If Button Appears But Doesn't Work:

1. **Check browser console** (F12):
   ```javascript
   // Look for errors like:
   // - "chrome.runtime.sendMessage failed"
   // - "Permission denied"
   // - Network errors
   ```

2. **Check background service worker**:
   - Go to `chrome://extensions/`
   - Find "Apptron Runner"
   - Click "Service worker" under "Inspect views"
   - Check console for errors

3. **Verify permissions**:
   - Go to `chrome://extensions/`
   - Click "Details" on Apptron Runner
   - Check "Site access" section
   - Should show "On specific sites" with github.com

### If New Tab Opens But Is Blank:

1. **Check Apptron service** is running:
   - Try visiting https://apptron.dev/ directly
   - Should load (even if shows error about no repo)

2. **Check network tab** (F12 → Network):
   - Look for failed requests
   - Check if URL parameters are correct

---

## 📸 **STEP 5: DOCUMENT YOUR FINDINGS**

### What to Report:

```markdown
## Test Results

**Browser**: Chrome [version number]
**OS**: Windows/Mac/Linux
**Extension Version**: 1.0.0

### Test 1: Button Appearance
- [ ] ✅ Pass / ❌ Fail
- Notes: [what you saw]
- Screenshot: [if helpful]

### Test 2: Button Click
- [ ] ✅ Pass / ❌ Fail
- Notes: [what happened]
- URL opened: [paste URL]

### Test 3: Popup
- [ ] ✅ Pass / ❌ Fail
- Notes: [what you saw]

### Test 4: Multiple Sessions
- [ ] ✅ Pass / ❌ Fail
- Repositories tested: [list]

### Test 5: Project Detection
- [ ] ✅ Pass / ❌ Fail
- Console output: [paste relevant logs]

### Errors Encountered:
[List any errors from console]

### Screenshots:
[Attach screenshots showing the extension in action]
```

---

## 🔬 **ADVANCED TESTING**

### Test Different Project Types:

```
Node.js:     https://github.com/vercel/next.js
Python:      https://github.com/django/django
Go:          https://github.com/golang/go
Rust:        https://github.com/rust-lang/rust
PHP:         https://github.com/laravel/laravel
Ruby:        https://github.com/rails/rails
```

### Test Edge Cases:

1. **Private repos** (if you have access)
2. **Archived repos**
3. **Repos with no files**
4. **Repos with unusual structures**
5. **Rapid clicking** (spam the button)
6. **Multiple browsers** (if possible)

---

## 📊 **EXPECTED VS ACTUAL**

### What Should Definitely Work:

✅ **Extension loads** without errors
✅ **Button appears** on GitHub repo pages
✅ **Button click** opens new tab with Apptron URL
✅ **URL parameters** are correctly generated
✅ **Popup** shows active sessions
✅ **Session tracking** works across tabs

### What Might Not Work Yet:

⚠️ **Apptron backend** might not handle the URL parameters
⚠️ **Repository auto-clone** not implemented on Apptron side
⚠️ **Auto-install dependencies** not implemented on Apptron side
⚠️ **Dev server auto-start** not implemented on Apptron side

**This is expected!** The extension is V1.0 - it passes parameters correctly, but Apptron backend needs Phase 2 updates.

---

## 🎯 **SUCCESS CRITERIA**

**Minimum Viable Test:**
```
1. Extension loads in Chrome ✅
2. Button appears on GitHub ✅
3. Button opens Apptron with URL params ✅
4. No JavaScript errors ✅
```

**If all 4 pass → Extension works!**

---

## 📝 **REPORTING BUGS**

If you find bugs, report with:

1. **Exact steps to reproduce**
2. **Browser console output** (F12 → Console)
3. **Extension console output** (if applicable)
4. **Screenshots** showing the issue
5. **URL** of the GitHub repo you tested on

Post to: https://github.com/Zeeeepa/apptron/issues

---

## 🚀 **NEXT STEPS AFTER TESTING**

1. **If it works**: Celebrate! The extension is functional!
2. **If bugs found**: Report them so they can be fixed
3. **After fixes**: Retest until everything works
4. **When ready**: Consider publishing to Chrome Web Store

---

**Happy Testing!** 🎉

