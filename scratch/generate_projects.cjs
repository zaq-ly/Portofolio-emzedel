const fs = require('fs');
const path = require('path');

const galleryDir = 'd:/PERKULIAHAN/Learning/Portofolio EMZEDEL/public/gallery';
const files = fs.readdirSync(galleryDir);

const projects = [];
let id = 1;

files.forEach(file => {
  if (file === 'foto_profil.JPG' || file === 'desktop.ini' || !file.includes('.')) return;

  let category = 'illustration';
  let title = file.split('.')[0];
  
  if (file.startsWith('Banner') || file.startsWith('Brosur') || file.startsWith('Poster')) {
    category = 'print';
  } else if (file.startsWith('Logo')) {
    category = 'branding';
  } else if (file.startsWith('Vektor')) {
    category = 'vector';
  } else if (file.includes('Graffiti') || file.includes('wildstyle') || file.includes('Tagging')) {
    category = 'graffiti';
  }

  // Clean up title
  title = title.replace(/^(Ilustrasi|Ilustarsi|Ilustrasii|Logo|Vektor|Banner|Brosur|Poster) - /i, '');
  title = title.replace(/_/g, ' ');
  title = title.charAt(0).toUpperCase() + title.slice(1);

  projects.push({
    id: id++,
    title: title,
    category: category,
    description: `Karya ${category} kreatif oleh Muhammad Zaqly Luluang.`,
    image: `/gallery/${file}`,
    tags: [category.charAt(0).toUpperCase() + category.slice(1), "Digital Art"]
  });
});

const output = `
export const projects = ${JSON.stringify(projects, null, 2)};

export const categories = [
  { key: "all", label: "Semua Karya" },
  { key: "illustration", label: "Ilustrasi" },
  { key: "vector", label: "Vektor" },
  { key: "branding", label: "Logo & Branding" },
  { key: "print", label: "Print & Banner" },
  { key: "graffiti", label: "Graffiti" },
];
`;

fs.writeFileSync('d:/PERKULIAHAN/Learning/Portofolio EMZEDEL/src/data/projects.js', output);
console.log(`Generated ${projects.length} projects.`);
