const fs = require('fs');
const files = [
  'src/views/Mouse/_mouse.json',
  'src/views/Keyboard/_keyboard.json',
  'src/views/Headphone/_headphone.json',
  'src/views/Accessories/_accessories.json'
];

files.forEach(f => {
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  const processed = data.map(item => {
    // Only process objects with name
    if (!item.name) return item;

    let parts = item.tags && item.tags[0] ? item.tags[0].split(' / ') : [];
    let cPart = parts[0] || '';
    let wPart = parts[1] || '';
    
    item.warranty = wPart;

    let connections = [];
    let lowerC = cPart.toLowerCase();
    if(lowerC.includes('có dây') || lowerC.includes('cắm dây')) connections.push('wired');
    if(lowerC.includes('không dây') || lowerC.includes('wireless')) connections.push('wireless');
    if(lowerC.includes('bluetooth')) connections.push('bluetooth');
    
    item.connect = connections;
    // We can clean cPart by removing the connection strings if we want, but let's just keep tags[0] without warranty.
    item.tags = [cPart.trim()];
    if(item.tags[0] === "") item.tags = [];

    return item;
  });

  fs.writeFileSync(f, JSON.stringify(processed, null, 2), 'utf8');
});
console.log('Done mapping JSONs.');
