# ⚡ Quick Start Guide - Apptron Runner

Get up and running in 5 minutes!

## 1️⃣ Install (2 minutes)

### Chrome / Edge / Brave
1. Download: `git clone https://github.com/tractordev/apptron.git`
2. Navigate to: `chrome://extensions/`
3. Enable: "Developer mode" toggle
4. Click: "Load unpacked"
5. Select: `apptron/extension` folder

✅ Done! Extension icon should appear in toolbar.

---

## 2️⃣ First Run (3 minutes)

### Try These Example Repos

**React App (Simple)**
```
https://github.com/facebook/create-react-app
```
1. Visit the URL above
2. Click "Run in Browser" (purple button)
3. Wait ~30 seconds for setup
4. See React app running!

**Next.js (Popular Framework)**
```
https://github.com/vercel/next.js
```
Click "Run in Browser" → Automatic setup → Live preview

**Python Flask (Backend)**
```
https://github.com/pallets/flask
```
Click "Run in Browser" → Python env loads → Flask server starts

---

## 3️⃣ Common Workflows

### Workflow 1: Quick Bug Reproduction
```
Problem: User reports bug in your project
Solution:
1. Ask for GitHub repo URL
2. Open URL in Chrome
3. Click "Run in Browser"
4. Reproduce bug instantly
5. Debug in browser
```

### Workflow 2: Learning New Framework
```
Scenario: Want to try Next.js
Solution:
1. Find Next.js example on GitHub
2. Click "Run in Browser"
3. Code loads automatically
4. Edit and experiment
5. See changes live
```

### Workflow 3: Code Review with Context
```
Scenario: Reviewing PR
Solution:
1. Go to PR on GitHub
2. Click "Run in Browser"
3. See changes running live
4. Test functionality
5. Leave informed comments
```

---

## 🎯 Tips & Tricks

### Tip 1: Multiple Sessions
```
✅ Open multiple repos at once
✅ Click extension icon to see all sessions
✅ Switch between them easily
```

### Tip 2: Check Status
```
Click extension icon → See:
• Repository name
• Run duration
• Current status
```

### Tip 3: Best Repos to Try
```
Easy:
• Static sites (HTML/CSS/JS)
• Simple Node.js apps
• Python Flask apps

Medium:
• React/Vue applications
• Next.js projects
• Express APIs

Advanced:
• Full-stack apps
• Monorepos
• Docker-based projects
```

---

## 📝 Keyboard Shortcuts

| Action | Shortcut | What It Does |
|--------|----------|--------------|
| Open popup | `Alt+Shift+A` | View sessions |
| Refresh page | `Ctrl+R` | Reload GitHub page |
| Open console | `F12` | Debug issues |

*(Note: Shortcuts coming in v1.1)*

---

## 🐛 Common Issues & Fixes

### Issue: Button doesn't appear
**Fix**: Refresh the GitHub page (`Ctrl+R`)

### Issue: Nothing happens when clicked
**Fix**: Check browser console (`F12`) for errors

### Issue: Slow loading
**Fix**: Normal! First load takes 30-60s (downloads runtime)

### Issue: Blank screen in Apptron
**Fix**: Wait 30 seconds, if still blank check internet connection

---

## 📊 What Happens When You Click?

```
You Click "Run in Browser"
    ↓
Extension detects repo type
    ↓
Opens Apptron in new tab
    ↓
Apptron starts VM (~10s)
    ↓
Clones git repository (~5s)
    ↓
Detects project type
    ↓
Installs dependencies (~15s)
    ↓
Starts dev server
    ↓
✨ Your app is running! ✨
```

**Total time**: 30-60 seconds on first run
**Cached run**: 10-15 seconds

---

## 🎓 Learning Resources

### Video Tutorials
- 📹 **Installation** (2 min): Coming soon
- 📹 **First Run** (5 min): Coming soon
- 📹 **Advanced Features** (10 min): Coming soon

### Example Projects
Try these beginner-friendly repos:
```
1. https://github.com/john-smilga/react-projects
2. https://github.com/bradtraversy/50projects50days
3. https://github.com/trekhleb/javascript-algorithms
```

### Documentation
- 📖 [Full README](./README.md)
- 📦 [Installation Guide](./INSTALL.md)
- 🏗️ [Architecture](./ARCHITECTURE.md)

---

## 💡 Use Cases

### For Students 🎓
```
• Try tutorial code instantly
• Learn new frameworks
• No local setup needed
• Share projects with classmates
```

### For Developers 💻
```
• Quick bug reproduction
• Test PRs before merging
• Explore new libraries
• Rapid prototyping
```

### For Teachers 👨‍🏫
```
• Live coding demos
• Share examples easily
• Students follow along
• No setup time wasted
```

### For Teams 🤝
```
• Consistent environments
• Easy onboarding
• Quick project sharing
• Cross-platform works everywhere
```

---

## 🚀 What's Next?

### Roadmap
- ✅ **v1.0**: GitHub integration ← YOU ARE HERE
- 🔄 **v1.1**: Auto-clone & install (coming soon)
- 🤖 **v2.0**: Claude AI debugging assistant
- 🎨 **v2.1**: Enhanced UI with terminal
- 🔐 **v3.0**: Private repo support

### Get Involved
- ⭐ Star on GitHub
- 🐛 Report bugs
- 💡 Suggest features
- 🔨 Contribute code

---

## ❓ FAQ

**Q: Is it free?**
A: Yes! Completely free and open source.

**Q: Do I need an account?**
A: No! Works without any signup.

**Q: What languages are supported?**
A: Node.js, Python, Go, Rust, PHP, Ruby, and more.

**Q: Can I use it offline?**
A: No, requires internet to download runtimes and repos.

**Q: Is my code private?**
A: Yes! Everything runs in your browser. Nothing is sent to servers except the public GitHub repo.

**Q: What about private repos?**
A: Not yet supported. Coming in v3.0 with OAuth.

**Q: Can I run production apps?**
A: Not recommended. This is for development/testing only.

**Q: How fast is it?**
A: Slower than native (x86 emulation), but fast enough for most dev work.

---

## 📧 Need Help?

- 💬 **Issues**: https://github.com/tractordev/apptron/issues
- 🐦 **Twitter**: @progrium
- 📧 **Email**: support@apptron.dev

---

**That's it! Start exploring GitHub repos in your browser!** 🎉

*Made with ❤️ by the Apptron team*

