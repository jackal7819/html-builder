const fs = require('fs');
const path = require('path');

async function copyDirectory(src, dest) {
  try {
    await fs.promises.mkdir(dest, { recursive: true });

    const items = await fs.promises.readdir(src, { withFileTypes: true });

    const destItems = await fs.promises.readdir(dest);
    for (const item of destItems) {
      const itemPath = path.join(dest, item);
      await fs.promises.rm(itemPath, { recursive: true, force: true });
    }

    for (const item of items) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);

      if (item.isFile()) {
        await fs.promises.copyFile(srcPath, destPath);
      }
      if (item.isDirectory()) {
        await copyDirectory(srcPath, destPath);
      }
    }

    console.log(`Directory ${src} copied to ${dest}`);
  } catch (error) {
    console.error('Error copying directory:', error);
  }
}

const srcFolder = path.join(__dirname, 'files');
const destFolder = path.join(__dirname, 'files-copy');

copyDirectory(srcFolder, destFolder);
