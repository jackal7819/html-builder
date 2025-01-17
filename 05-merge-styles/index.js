const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const bundlePath = path.join(outputDir, 'bundle.css');

async function mergeStyles() {
  try {
    await fs.promises.mkdir(outputDir, { recursive: true });

    const writeStream = fs.createWriteStream(bundlePath);

    const files = await fs.promises.readdir(stylesDir, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(stylesDir, file.name);

      if (file.isFile() && path.extname(file.name) === '.css') {
        const data = await fs.promises.readFile(filePath, 'utf-8');
        writeStream.write(data + '\n');
      }
    }

    writeStream.end();
    console.log('Styles merged successfully into bundle.css');
  } catch (error) {
    console.error('Error merging styles:', error);
  }
}

mergeStyles();
