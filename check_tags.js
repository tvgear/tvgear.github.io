const fs = require('fs');
const files = [
  'src/views/Mouse/_mouse.json',
  'src/views/Keyboard/_keyboard.json',
  'src/views/Headphone/_headphone.json',
  'src/views/Accessories/_accessories.json'
];

let parts = new Set();
let tagSets = new Set();
files.forEach(f => {
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  data.forEach(item => {
    if (item.tags && item.tags.length > 0) {
      tagSets.add(item.tags[0]);
      let split = item.tags[0].split(' / ');
      parts.add(split[0]);
    }
  });
});
console.log(Array.from(parts).join('\n'));
