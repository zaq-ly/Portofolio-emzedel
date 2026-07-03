const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const input = path.join(__dirname, 'public/favicon.png');
const output = path.join(__dirname, 'public/favicon_cropped.png');

async function processImage() {
  try {
    console.log('Memangkas ruang kosong di sekitar logo...');
    await sharp(input)
      .trim() // Otomatis membuang background kosong/transparan di pinggiran
      .toFile(output);
      
    fs.renameSync(output, input);
    console.log('Selesai diperbesar (dipangkas)!');
  } catch (error) {
    console.error('Gagal:', error);
  }
}

processImage();
