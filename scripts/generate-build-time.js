const fs = require('fs');
const path = require('path');

/**
 * Generates the current time in Vietnamese format: HH:mm:ss Thứ X, D/M/YYYY
 */
function getFormattedTime() {
  const now = new Date();
  
  // Calculate Vietnam time (GMT+7) regardless of environment timezone
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const vn = new Date(utc + (3600000 * 7));
  
  const hh = vn.getHours().toString().padStart(2, '0');
  const mm = vn.getMinutes().toString().padStart(2, '0');
  const ss = vn.getSeconds().toString().padStart(2, '0');
  
  const d = vn.getDate();
  const m = vn.getMonth() + 1;
  const y = vn.getFullYear();
  
  return `${hh}:${mm}:${ss}, ${d}/${m}/${y}`;
}

const metadata = {
  lastUpdated: getFormattedTime()
};

const targetFile = path.join(__dirname, '../src/metadata.json');
const targetDir = path.dirname(targetFile);

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(targetFile, JSON.stringify(metadata, null, 2));

console.log('✅ Build time generated:', metadata.lastUpdated);
