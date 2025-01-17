const fs = require('fs');
const readLine = require('readline');

const filePath = './02-write-file/output.txt';
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Welcome! Please enter some text and I will write it to a file.');
console.log('Type "exit" to quit.');

rl.on('line', (input) => {
  if (input === 'exit') {
    console.log('Goodbye!');
    rl.close();
    process.exit();
  } else {
    writeStream.write(input + '\n');
  }
});

rl.on('SIGINT', () => {
  console.log('\nGoodbye!');
  rl.close();
  writeStream.end();
});
