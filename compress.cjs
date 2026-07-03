const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public/gallery/Banner - Semhas PettaCoffee.jpg');
const tempPath = path.join(__dirname, 'public/gallery/temp_Banner.jpg');

async function compress() {
  try {
    console.log('Mulai kompresi gambar raksasa...');
    await sharp(filePath)
      .resize({ width: 2000, withoutEnlargement: true }) // Perkecil lebar maksimal 2000px
      .jpeg({ quality: 80 }) // Turunkan kualitas sedikit
      .toFile(tempPath);
    
    fs.renameSync(tempPath, filePath);
    console.log('Kompresi berhasil! Ukuran file sekarang jauh lebih kecil.');
  } catch (err) {
    console.error('Error saat kompresi:', err);
  }
}
compress();
