const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

const readStream = fs.createReadStream(filePath, 'utf-8');

readStream.pipe(process.stdout);

readStream.on('error', (error) => {
  console.error('Error reading file:', error);
});
