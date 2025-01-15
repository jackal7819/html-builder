const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.promises
  .readdir(folderPath, { withFileTypes: true })
  .then((files) => {
    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);

        fs.promises
          .stat(filePath)
          .then((stats) => {
            const extname = path.extname(file.name).slice(1);
            const size = (stats.size / 1024).toFixed(3);

            console.log(`${file.name} - ${extname} - ${size}kb`);
          })
          .catch((error) => {
            console.error('Error reading file stats:', error);
          });
      }
    });
  })
  .catch((error) => {
    console.error('Error reading directory:', error);
  });
