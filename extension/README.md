# 🚀 Deploy to Apptron - Chrome Extension

One-click deployment of GitHub projects to Apptron with automatic environment variable detection and configuration.

## Features

✅ **One-Click Deployment** - Deploy any GitHub repository to Apptron instantly  
✅ **Smart Environment Detection** - Automatically finds and parses `.env.example`, `config.json`, and other config files  
✅ **Interactive Configuration** - Beautiful UI for setting environment variables before deployment  
✅ **Project Type Detection** - Identifies Node.js, Python, Go, Rust, Docker projects automatically  
✅ **GitHub Integration** - Seamlessly integrates with GitHub's UI  

## Installation

### From Source (Development)

1. Clone this repository
2. Navigate to `chrome://extensions/` in Chrome
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the `extension/` directory

### From Chrome Web Store (Coming Soon)

Will be available on the Chrome Web Store once approved.

## Usage

1. **Navigate to any GitHub repository**
   - Go to https://github.com/{owner}/{repo}

2. **Click "Deploy to Apptron" button**
   - Button appears next to the branch selector
   - Extension automatically analyzes the project

3. **Configure environment variables**
   - A new tab opens with detected variables
   - Fill in required values (marked with "REQUIRED" badge)
   - Optional variables can be left empty

4. **Deploy!**
   - Click "Deploy Now"
   - Apptron opens in a new tab
   - Your environment is ready to use

## Supported Configuration Files

The extension automatically detects and parses:

- `.env.example`
- `.env.template`
- `.env.sample`
- `config.example.json`
- `docker-compose.yml`
- `package.json` (for Node.js specific variables)

## How It Works

### Architecture

```
GitHub Page (Content Script)
    ↓
Button Click → Analyze Project
    ↓
Fetch Config Files (GitHub API)
    ↓
Parse Environment Variables
    ↓
Open Configuration Page
    ↓
User Fills Variables
    ↓
Deploy to Apptron (Background Script)
    ↓
Open Apptron with Parameters
```

### File Structure

```
extension/
├── manifest.json           # Extension configuration
├── background.js           # Service worker (handles deployments)
├── content-script.js       # Injects button on GitHub
├── env-config.html         # Configuration page UI
├── env-config.js           # Configuration page logic
├── popup.html              # Extension popup
├── lib/
│   ├── github-api.js       # GitHub API helper
│   └── env-parser.js       # Environment file parser
├── styles/
│   └── content.css         # Button styling
└── icons/                  # Extension icons
```

## Environment Variable Detection

### .env Files

Automatically detects:
- Variable names (KEY format)
- Default values
- Required vs optional (heuristics)
- Variable types (password, email, url, number, etc.)

### Example

```bash
# .env.example
DATABASE_URL=                    # Detected as REQUIRED
PORT=3000                        # Detected as optional (has default)
API_SECRET_KEY=                  # Detected as REQUIRED (password type)
ENABLE_LOGGING=true              # Detected as boolean
```

Becomes:

```
DATABASE_URL     [Required]  Type: URL
PORT             [Optional]  Type: Number (default: 3000)
API_SECRET_KEY   [Required]  Type: Password
ENABLE_LOGGING   [Optional]  Type: Boolean (default: true)
```

## Development

### Prerequisites

- Chrome/Chromium browser
- Basic knowledge of Chrome extensions

### Local Development

1. Make changes to the code
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test on a GitHub repository

### Testing

Visit any of these repositories to test:

- https://github.com/vercel/next.js
- https://github.com/facebook/react
- https://github.com/nodejs/node

## Permissions

The extension requires:

- `activeTab` - To inject the deployment button
- `storage` - To temporarily store deployment configuration
- `tabs` - To open Apptron in a new tab
- `https://github.com/*/*` - To access GitHub repositories
- `https://raw.githubusercontent.com/*` - To fetch config files

## Privacy

- ✅ No data is collected or sent to external servers
- ✅ Environment variables are only sent to Apptron (user-initiated)
- ✅ GitHub API requests are made directly from your browser
- ✅ All code is open source and auditable

## Limitations

- Only works on public GitHub repositories (for now)
- Requires Apptron to support the URL parameter format
- Some complex config formats may not be fully parsed

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- Issues: https://github.com/tractordev/apptron/issues
- Apptron Docs: https://apptron.dev/docs
- Extension Docs: This README

## Changelog

### v1.0.0 (2025-12-05)

- ✨ Initial release
- ✅ One-click deployment
- ✅ Environment variable detection
- ✅ Project type detection
- ✅ Beautiful configuration UI

