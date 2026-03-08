const fs = require('fs');
const path = require('path');

/**
 * Generates the current time in Vietnamese format: HH:mm:ss Thứ X, D/M/YYYY
 */
function getFormattedTime() {
  const now = new Date();
  
  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const dayName = days[now.getDay()];
  
  const hh = now.getHours().toString().padStart(2, '0');
  const mm = now.getMinutes().toString().padStart(2, '0');
  const ss = now.getSeconds().toString().padStart(2, '0');
  
  const d = now.getDate();
  const m = now.getMonth() + 1;
  const y = now.getFullYear();
  
  return `${hh}:${mm}:${ss} ${dayName}, ${d}/${m}/${y}`;
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
