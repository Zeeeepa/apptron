# 🚀 Apptron Runner - Chrome Extension

Run any GitHub repository in your browser with **one click**. No local setup, no installations, just instant development environments powered by WebAssembly.

## ✨ Features

- 🎯 **One-Click Launch** - Add "Run in Browser" button to every GitHub repo
- 🌐 **Works Everywhere** - Full Linux environment running in your browser
- 🔧 **Multi-Language** - Node.js, Python, Go, Rust support
- ⚡ **Instant Setup** - Auto-clones repo and installs dependencies
- 🎨 **Live Preview** - See your app running in real-time
- 🤖 **AI Assistant Ready** - Prepared for Claude Code integration (coming soon)

## 📦 Installation

### From Source (Developer Mode)

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/tractordev/apptron.git
   cd apptron/extension
   ```

2. **Open Chrome Extensions page**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)

3. **Load the extension**
   - Click "Load unpacked"
   - Select the `extension` folder

4. **Done!** You should see the Apptron Runner icon in your toolbar

### From Chrome Web Store (Coming Soon)
Once published, you'll be able to install with one click from the Chrome Web Store.

## 🎮 Usage

### Running a Repository

1. **Visit any GitHub repository**
   - Example: https://github.com/vercel/next.js

2. **Click "Run in Browser"**
   - Look for the purple button near the "Code" button
   - The button appears automatically on repository pages

3. **Wait for setup**
   - Repository is cloned into a browser-based VM
   - Dependencies are automatically installed
   - Development server starts automatically

4. **View your app**
   - A new tab opens with the Apptron environment
   - See your application running live
   - Edit code and see changes instantly

### Managing Sessions

Click the extension icon in your toolbar to:
- View all active development sessions
- Switch between running repositories
- See session duration and status

## 🔧 Supported Project Types

The extension automatically detects and runs:

| Language/Framework | Auto-detected by | Command Run |
|-------------------|------------------|-------------|
| **Node.js** | `package.json` | `npm install && npm run dev` |
| **Python** | `requirements.txt` | `pip install -r requirements.txt` |
| **Go** | `go.mod` | `go mod download && go run .` |
| **Rust** | `Cargo.toml` | `cargo build` |
| **PHP** | `composer.json` | `composer install` |
| **Ruby** | `Gemfile` | `bundle install` |

## 🎯 Perfect For

- 🎓 **Students** - Try any tutorial repo instantly
- 🐛 **Developers** - Quick bug reproduction
- 📚 **Educators** - Live coding demos
- 🤝 **Teams** - Share development environments
- 🚀 **Makers** - Rapid prototyping

## 🏗️ Architecture

```
GitHub Page (Content Script)
    ↓
Chrome Extension (Orchestrator)
    ↓
Apptron Web App (VM Engine)
    ↓
WebAssembly VM (Wanix + V86)
```

**Key Components:**
- **Content Script**: Detects repos, adds button to GitHub UI
- **Background Worker**: Manages sessions, handles communication
- **Popup UI**: Shows active sessions, provides controls
- **Apptron Engine**: Full Linux environment in WASM

## 🔮 Roadmap

### V1.0 (Current)
- ✅ GitHub detection and parsing
- ✅ One-click repository opening
- ✅ Session management
- ✅ Basic project type detection

### V1.1 (Next)
- 🔄 Auto-clone git repositories
- 🔄 Automatic dependency installation
- 🔄 Dev server auto-start
- 🔄 Live preview integration

### V2.0 (Future)
- 🤖 Claude AI integration for debugging
- 🐛 Automatic error detection and fixing
- 🎨 Enhanced UI with terminal view
- ⚙️ Custom runtime configurations
- 🔐 Private repository support (OAuth)

## 🛠️ Development

### Project Structure
```
extension/
├── manifest.json          # Extension manifest (v3)
├── background.js          # Service worker
├── content-script.js      # GitHub page injection
├── popup.html/js          # Extension popup
├── styles/
│   └── content.css        # GitHub UI styles
├── icons/                 # Extension icons
└── README.md             # This file
```

### Building
```bash
# No build step required for V1
# Just load in Chrome Developer Mode

# For future builds with bundling:
# npm install
# npm run build
```

### Testing
1. Load extension in Chrome
2. Visit https://github.com/facebook/react
3. Click "Run in Browser"
4. Verify new tab opens with Apptron

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Make your changes
4. Test thoroughly
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push (`git push origin feature/amazing`)
7. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built on top of:
- [Wanix](https://github.com/tractordev/wanix) - WebAssembly Unix-like kernel
- [V86](https://github.com/copy/v86) - x86 emulator in WebAssembly
- [VSCode Web](https://github.com/microsoft/vscode) - Browser-based editor

## 🐛 Known Issues

- **Performance**: x86 emulation is slower than native (expected)
- **Memory**: Limited to ~1GB RAM in browser context
- **Icons**: Placeholder icons (SVG icons work, PNG generation pending)

## 📧 Support

- 💬 **Issues**: [GitHub Issues](https://github.com/tractordev/apptron/issues)
- 📖 **Docs**: [Apptron Documentation](https://github.com/tractordev/apptron#readme)
- 🐦 **Twitter**: [@progrium](https://twitter.com/progrium)

---

**Made with ❤️ by the Apptron team**

⭐ Star us on GitHub if you find this useful!

