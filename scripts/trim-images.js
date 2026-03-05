const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/assets/images');
const extensions = ['.png', '.jpg', '.jpeg', '.webp'];

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (extensions.includes(ext)) {
        try {
          console.log(`Processing: ${fullPath}`);
          const buffer = await sharp(fullPath)
            .trim()
            .toBuffer();
          
          fs.writeFileSync(fullPath, buffer);
          console.log(`Success: ${fullPath}`);
        } catch (error) {
          console.error(`Error processing ${fullPath}:`, error.message);
        }
      }
    }
  }
}

processDirectory(targetDir).then(() => {
  console.log('Finished processing all images.');
}).catch(err => {
  console.error('Fatal error:', err);
});
