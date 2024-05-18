const fs = require('fs');
const path = require('path');

const pumpImagesDir = path.join(__dirname, 'DummyImages', 'PumpImages');
const partImagesDir = path.join(__dirname, 'DummyImages', 'PartImages');

const getImagesFromDir = (dir) => {
  return fs.readdirSync(dir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
  }).map(file => path.join(dir, file));
};

const pumpImages = getImagesFromDir(pumpImagesDir);
const partImages = getImagesFromDir(partImagesDir);

const imagePaths = {
  pumpImages,
  partImages,
};

fs.writeFileSync(path.join(__dirname, 'imagePaths.json'), JSON.stringify(imagePaths, null, 2));

console.log('Image paths fetched and saved to imagePaths.json');
