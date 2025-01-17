const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const outputHTML = path.join(projectDist, 'index.html');
const outputCSS = path.join(projectDist, 'style.css');
const outputAssets = path.join(projectDist, 'assets');

async function createProjectDist() {
  await fs.promises.mkdir(projectDist, { recursive: true });
}

async function processTemplate() {
  let templateContent = await fs.promises.readFile(templateFile, 'utf-8');
  const templateTags = templateContent.match(/{{\s*[\w]+\s*}}/g) || [];

  for (const tag of templateTags) {
    const componentName = tag.replace(/[{}]/g, '').trim();
    const componentPath = path.join(componentsDir, `${componentName}.html`);

    try {
      const componentContent = await fs.promises.readFile(
        componentPath,
        'utf-8',
      );
      templateContent = templateContent.replace(tag, componentContent);
    } catch (error) {
      console.error(`Component not found: ${componentName}`);
    }
  }

  await fs.promises.writeFile(outputHTML, templateContent);
}

async function mergeStyles() {
  const files = await fs.promises.readdir(stylesDir, { withFileTypes: true });
  const writeStream = fs.createWriteStream(outputCSS);

  for (const file of files) {
    const filePath = path.join(stylesDir, file.name);

    if (file.isFile() && path.extname(file.name) === '.css') {
      const data = await fs.promises.readFile(filePath, 'utf-8');
      writeStream.write(data + '\n');
    }
  }

  writeStream.end();
}

async function copyAssets(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const items = await fs.promises.readdir(src, { withFileTypes: true });

  for (const item of items) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);

    if (item.isDirectory()) {
      await copyAssets(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

async function buildPage() {
  try {
    await createProjectDist();
    await processTemplate();
    await mergeStyles();
    await copyAssets(assetsDir, outputAssets);
    console.log('Page built successfully');
  } catch (error) {
    console.error('Error building page:', error);
  }
}

buildPage();
