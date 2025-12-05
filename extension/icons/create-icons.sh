#!/bin/bash
# Create simple SVG-based icons

# 16x16 icon
cat > icon16.svg << 'ICON16'
<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="16" height="16" rx="3" fill="url(#grad)"/>
  <path d="M4 4h8v6H4z" fill="white" opacity="0.9"/>
  <rect x="5" y="11" width="6" height="3" rx="1" fill="white" opacity="0.9"/>
</svg>
ICON16

# 48x48 icon
cat > icon48.svg << 'ICON48'
<svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="48" height="48" rx="8" fill="url(#grad)"/>
  <path d="M12 12h24v18H12z" fill="white" opacity="0.9"/>
  <rect x="15" y="33" width="18" height="6" rx="2" fill="white" opacity="0.9"/>
</svg>
ICON48

# 128x128 icon
cat > icon128.svg << 'ICON128'
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="20" fill="url(#grad)"/>
  <path d="M32 32h64v48H32z" fill="white" opacity="0.9"/>
  <rect x="40" y="88" width="48" height="16" rx="6" fill="white" opacity="0.9"/>
</svg>
ICON128

# Convert SVG to PNG using ImageMagick or rsvg-convert if available
if command -v convert &> /dev/null; then
    convert icon16.svg icon16.png
    convert icon48.svg icon48.png
    convert icon128.svg icon128.png
    echo "Icons created with ImageMagick"
elif command -v rsvg-convert &> /dev/null; then
    rsvg-convert -w 16 -h 16 icon16.svg > icon16.png
    rsvg-convert -w 48 -h 48 icon48.svg > icon48.png
    rsvg-convert -w 128 -h 128 icon128.svg > icon128.png
    echo "Icons created with rsvg-convert"
else
    echo "WARNING: No SVG converter found. Using SVG files directly."
    cp icon16.svg icon16.png
    cp icon48.svg icon48.png
    cp icon128.svg icon128.png
fi
