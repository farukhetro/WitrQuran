const fs = require('fs');
const path = require('path');

const srcLogo = path.join(__dirname, 'Logos', 'Website Logo', 'Header And Footer Logo.png');
const destLogo = path.join(__dirname, 'public', 'logo.png');

const srcFaviconsDir = path.join(__dirname, 'Logos', 'Website Logo', 'Favicon');
const destPublicDir = path.join(__dirname, 'public');

// Copy Logo
if (fs.existsSync(srcLogo)) {
  fs.copyFileSync(srcLogo, destLogo);
  console.log('✅ Copied Header And Footer Logo.png to public/logo.png');
} else {
  console.error('❌ Logo not found at:', srcLogo);
}

// Copy Favicons
if (fs.existsSync(srcFaviconsDir)) {
  const files = fs.readdirSync(srcFaviconsDir);
  files.forEach(file => {
    const srcFile = path.join(srcFaviconsDir, file);
    const destFile = path.join(destPublicDir, file);
    if (fs.statSync(srcFile).isFile()) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`✅ Copied ${file} to public/`);
    }
  });
} else {
  console.error('❌ Favicons directory not found at:', srcFaviconsDir);
}
