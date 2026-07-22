const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\User\\OneDrive\\Documents\\Quran Listening\\Logos\\Mini Logos\\Surah Photo.jpeg';
const destDir = 'C:\\Users\\User\\OneDrive\\Documents\\Quran Listening\\public';
const dest = path.join(destDir, 'surah-photo.jpeg');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('File copied successfully');
