const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'app', 'surahs', '[id]');
if (fs.existsSync(targetPath)) {
  fs.rmSync(targetPath, { recursive: true, force: true });
  console.log('Deleted old route successfully.');
}
