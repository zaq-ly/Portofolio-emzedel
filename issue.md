# Portfolio Design Grafis — Muhammad Zaqly Luluang

## Deskripsi

Membuat website portfolio **design grafis** untuk **Muhammad Zaqly Luluang** menggunakan React JS dan Tailwind CSS v3. Tujuan utama website ini adalah **memudahkan orang lain mengetahui siapa Muhammad Zaqly Luluang dan apa yang bisa dilakukannya** di bidang design grafis. Gambar karya/art diambil dari **Google Drive folder "My art"**.

## Tech Stack

- **React JS** (via Vite)
- **Tailwind CSS v3**
- **Lucide React** (untuk ikon)
- **Framer Motion** atau CSS Animations (untuk animasi & transisi)

## Desain UI

Desain harus memenuhi kriteria berikut:
- **Modern** — mengikuti tren desain terkini (2024-2026)
- **Futuristik** — elemen-elemen yang terasa _cutting-edge_ (gradien neon, glassmorphism, subtle glow effects)
- **Minimalis** — whitespace yang cukup, tidak berlebihan elemen dekoratif
- **Elegan** — tipografi premium, palet warna yang kalem dan harmonis
- **Profesional** — layout rapi, hierarki visual yang jelas
- **Premium** — micro-interactions, animasi halus, perhatian terhadap detail

---

## Tasks

---

### 1. Setup Project

**Tujuan:** Menyiapkan fondasi project agar siap dikembangkan.

#### Detail Implementasi:

1. **Inisialisasi Vite + React** di folder saat ini (`./`)
   ```bash
   npx create-vite@latest ./ --template react --no-interactive --overwrite
   npm install
   ```

2. **Install Tailwind CSS v3** beserta dependensi:
   ```bash
   npm install -D tailwindcss@3 postcss autoprefixer
   npx tailwindcss init -p
   ```

3. **Install dependensi tambahan:**
   ```bash
   npm install lucide-react framer-motion
   ```

4. **Konfigurasi `tailwind.config.js`:**
   ```js
   module.exports = {
     content: ["./index.html", "./src/**/*.{js,jsx}"],
     darkMode: 'class',
     theme: {
       extend: {
         colors: {
           primary: '#6366f1',      // indigo modern
           secondary: '#a5b4fc',    // indigo light
           accent: '#06b6d4',       // cyan futuristik
           dark: '#0a0a0f',         // near-black background
           'dark-card': '#13131a',  // card background
           'dark-border': '#1e1e2e', // subtle borders
           light: '#f8fafc',
         },
         fontFamily: {
           sans: ['Inter', 'system-ui', 'sans-serif'],
           display: ['Outfit', 'sans-serif'],
         },
         animation: {
           'fade-in': 'fadeIn 0.8s ease-out forwards',
           'slide-up': 'slideUp 0.6s ease-out forwards',
           'glow': 'glow 2s ease-in-out infinite alternate',
         },
         keyframes: {
           fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
           slideUp: { '0%': { opacity: 0, transform: 'translateY(30px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
           glow: { '0%': { boxShadow: '0 0 5px rgba(99,102,241,0.3)' }, '100%': { boxShadow: '0 0 20px rgba(99,102,241,0.6)' } },
         },
       },
     },
     plugins: [],
   }
   ```

5. **Setup `src/index.css`:**
   ```css
   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');

   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   @layer base {
     html { scroll-behavior: smooth; }
     body {
       @apply bg-dark text-light font-sans antialiased;
     }
     ::selection {
       @apply bg-primary/30 text-white;
     }
   }
   ```

6. **Bersihkan boilerplate Vite:**
   - Hapus `src/App.css`
   - Hapus `src/assets/react.svg`
   - Kosongkan `src/App.jsx` (akan diisi ulang)

7. **Setup struktur folder:**
   ```
   src/
   ├── components/    (Navbar, Footer, ProjectCard, SkillBadge, dll.)
   ├── sections/      (Hero, About, Gallery, Contact)
   ├── assets/        (gambar, ikon)
   ├── data/          (data portfolio statis: projects.js, skills.js)
   └── hooks/         (custom hooks jika diperlukan, misal useScrollReveal)
   ```

8. **Update `index.html`:**
   - Ganti `<title>` menjadi `Muhammad Zaqly Luluang — Graphic Designer`
   - Tambahkan meta description: `Portfolio design grafis Muhammad Zaqly Luluang. Lihat karya-karya kreatif dan layanan desain yang ditawarkan.`
   - Tambahkan link favicon

---

### 2. Layout & Navigasi

**Tujuan:** Membuat shell layout (Navbar + Footer) yang konsisten di semua halaman.

#### 2.1 Komponen `Navbar` (`src/components/Navbar.jsx`)

**Spesifikasi:**
- **Posisi:** Fixed di atas, `z-50`
- **Background:** Transparan saat di atas, lalu glassmorphism (`bg-dark/80 backdrop-blur-xl`) setelah scroll 20px
- **Logo/Brand:** Teks "Muhammad Zaqly Luluang" atau inisial "MZL" — gunakan `font-display` (Outfit), font bold, dengan gradient text (`bg-gradient-to-r from-primary to-accent`)
- **Nav Links:** Home, About, Gallery, Contact — font medium, warna `text-gray-400`, hover jadi `text-white` dengan transisi `transition-colors duration-300`
- **Dark Mode Toggle:** Tombol Sun/Moon dari Lucide, `p-2 rounded-full`, hover background subtle
- **Mobile (< `md`):**
  - Tombol hamburger (ikon Menu/X dari Lucide)
  - Menu dropdown full-width dengan animasi slide-down
  - Background `bg-dark/95 backdrop-blur-xl`
  - Links berukuran `text-lg`, spasi `space-y-4`, padding `py-6 px-6`
  - Klik link → tutup menu + smooth scroll
- **Animasi scroll:** Gunakan `useEffect` + `window.addEventListener('scroll')` untuk deteksi scroll position dan ubah style navbar

#### 2.2 Komponen `Footer` (`src/components/Footer.jsx`)

**Spesifikasi:**
- **Background:** `bg-dark-card` dengan `border-t border-dark-border`
- **Layout:** Flex column center, atau 2 kolom (brand kiri, links kanan) di desktop
- **Brand:** Nama "Muhammad Zaqly Luluang" dengan gradient text (sama seperti navbar)
- **Tagline:** `"Turning ideas into visual stories."` — warna `text-gray-500`
- **Social Links:** GitHub, LinkedIn, Instagram, Behance/Dribbble — ikon dari Lucide, ukuran 20px
  - Hover: `text-primary` + scale 110%
  - Padding: `p-2`, border-radius full
- **Copyright:** `© 2026 Muhammad Zaqly Luluang. All rights reserved.` — `text-sm text-gray-600`
- **Divider:** Garis `border-t border-dark-border` antara konten dan copyright

---

### 3. Section: Hero (`src/sections/Hero.jsx`)

**Tujuan:** Kesan pertama yang kuat — menunjukkan siapa Muhammad Zaqly Luluang dan apa spesialisasinya.

#### Spesifikasi Layout:

- **Full viewport height:** `min-h-screen`, centered secara vertikal
- **Layout:** 2 kolom di desktop (teks kiri, visual kanan), stack di mobile
- **Padding:** `pt-32 pb-20` (memberikan ruang untuk navbar fixed)

#### Konten Kolom Kiri (Teks):

1. **Subtitle kecil:** `"GRAPHIC DESIGNER & VISUAL ARTIST"` — `text-primary font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4`
2. **Heading utama:**
   ```
   Hi, I'm
   Muhammad Zaqly Luluang
   ```
   - `text-4xl md:text-6xl lg:text-7xl font-display font-extrabold leading-tight`
   - Nama dibungkus `<span>` dengan `text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent`
3. **Deskripsi:** `"A passionate graphic designer specializing in brand identity, digital illustration, and visual storytelling. I transform ideas into captivating visual experiences."` — `text-lg text-gray-400 mb-10 max-w-lg leading-relaxed`
4. **CTA Buttons (2 tombol):**
   - **Primary:** "View My Work" — `bg-primary hover:bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/30` + ikon ArrowRight (Lucide) yang translate-x saat hover
   - **Secondary:** "Contact Me" — `border-2 border-dark-border text-white px-8 py-4 rounded-xl font-bold hover:bg-dark-card hover:border-primary/50`

#### Konten Kolom Kanan (Visual):

- **Foto profil** atau **artwork showcase** dalam container `w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96`
- **Efek dekoratif:**
  - Border: `border-4 border-dark-card` + `rounded-3xl`
  - Background glow: `div` absolute di belakang, `bg-gradient-to-tr from-primary to-accent rounded-3xl rotate-6 opacity-20`, animasi `animate-pulse` atau `animate-glow`
  - Floating blur circles: 2-3 `div` absolute dengan `bg-primary/10` dan `bg-accent/10`, `rounded-full blur-3xl`

#### Animasi:

- Teks muncul dengan `animate-fade-in` atau `animate-slide-up` (delay bertahap: subtitle 0s, heading 0.2s, deskripsi 0.4s, buttons 0.6s)
- Foto/visual muncul dengan fade-in + scale dari 0.9 ke 1

---

### 4. Section: About (`src/sections/About.jsx`)

**Tujuan:** Menjelaskan siapa Muhammad Zaqly Luluang, latar belakang, dan keahliannya di bidang design grafis.

#### Spesifikasi Layout:

- **Background:** `bg-dark-card/50` (sedikit beda dari section lain untuk kontras)
- **Padding:** `py-20 md:py-28`
- **Layout:** 2 kolom di desktop (kiri: teks, kanan: skills), stack di mobile

#### Konten Kolom Kiri:

1. **Section label:** `"ABOUT ME"` — `text-primary font-bold uppercase tracking-[0.2em] text-sm mb-4`
2. **Heading:** `"Creative Designer Based in Indonesia"` — `text-3xl md:text-4xl font-display font-bold text-white mb-6`
3. **Paragraf bio (2 paragraf):**
   - Ceritakan tentang pengalaman di bidang design grafis, passion, dan pendekatan kreatif
   - Warna `text-gray-400 text-lg leading-relaxed mb-6`
4. **Statistik grid (2x2):**
   - Setiap item: angka besar (`text-2xl font-bold text-primary`) + label (`text-sm text-gray-500`)
   - Contoh: `"50+"` Projects Completed, `"3+"` Years Experience, `"20+"` Happy Clients, `"100+"` Designs Created
   - Styling: `bg-dark-card p-4 rounded-xl border border-dark-border`

#### Konten Kolom Kanan — Skills:

1. **Sub-heading:** `"My Design Skills"` — `text-xl font-bold text-white mb-6`
2. **Skill badges** — tampilkan sebagai pill/badge:
   - Skills: `Adobe Photoshop`, `Adobe Illustrator`, `Figma`, `Canva`, `Brand Identity`, `Typography`, `Digital Illustration`, `Layout Design`, `Color Theory`, `UI/UX Design`, `Photo Editing`, `Social Media Design`
   - Styling per badge: `px-5 py-2 bg-dark rounded-full text-sm font-medium text-gray-300 border border-dark-border hover:border-primary hover:text-primary transition-all duration-300 cursor-default`
   - Flex wrap: `flex flex-wrap gap-3`

3. **Quote card:**
   - `"Design is not just what it looks like. Design is how it works."` — Steve Jobs
   - Styling: `p-8 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border border-primary/10 mt-12`
   - Quote: `italic text-white font-bold`, Author: `text-gray-500 text-sm`

---

### 5. Section: Gallery / Projects (`src/sections/Gallery.jsx`)

**Tujuan:** Menampilkan karya-karya design grafis Muhammad Zaqly Luluang dalam format galeri yang menarik.

#### Sumber Gambar:

- **Gambar diambil dari Google Drive folder "My art"**
- Download gambar-gambar dari folder tersebut dan simpan di `src/assets/gallery/` atau `public/gallery/`
- Jika akses Google Drive tidak tersedia, gunakan placeholder images dari `https://via.placeholder.com/600x400` dengan catatan akan diganti nanti

#### Data Project (`src/data/projects.js`):

Buat file data statis berisi array objek project:
```js
export const projects = [
  {
    id: 1,
    title: "Brand Identity Design",
    category: "branding",
    description: "Complete brand identity package including logo, color palette, and brand guidelines.",
    image: "/gallery/project1.jpg",  // atau import dari assets
    tags: ["Logo", "Branding", "Illustrator"],
  },
  {
    id: 2,
    title: "Social Media Campaign",
    category: "social-media",
    description: "Series of social media post designs for product launch campaign.",
    image: "/gallery/project2.jpg",
    tags: ["Social Media", "Photoshop", "Canva"],
  },
  {
    id: 3,
    title: "Digital Illustration",
    category: "illustration",
    description: "Custom digital illustrations for editorial and commercial use.",
    image: "/gallery/project3.jpg",
    tags: ["Illustration", "Digital Art", "Photoshop"],
  },
  {
    id: 4,
    title: "Poster & Flyer Design",
    category: "print",
    description: "Eye-catching poster and flyer designs for events and promotions.",
    image: "/gallery/project4.jpg",
    tags: ["Print", "Layout", "Typography"],
  },
  {
    id: 5,
    title: "UI/UX Concept",
    category: "ui-ux",
    description: "Mobile app interface concept with modern and clean design approach.",
    image: "/gallery/project5.jpg",
    tags: ["UI/UX", "Figma", "Prototype"],
  },
  {
    id: 6,
    title: "Photo Manipulation",
    category: "photo-edit",
    description: "Creative photo manipulation and compositing for artistic projects.",
    image: "/gallery/project6.jpg",
    tags: ["Photo Edit", "Photoshop", "Compositing"],
  },
];
```

#### 5.1 Komponen `ProjectCard` (`src/components/ProjectCard.jsx`)

**Spesifikasi per card:**
- **Container:** `rounded-2xl overflow-hidden border border-dark-border bg-dark-card group` + `h-full flex flex-col`
- **Image area:** `h-60 overflow-hidden relative`
  - `<img>` dengan `w-full h-full object-cover group-hover:scale-110 transition-transform duration-700`
  - Overlay saat hover: `absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`
  - Tombol "View" di overlay: ikon ExternalLink (Lucide), `bg-white p-2 rounded-full text-dark hover:bg-primary hover:text-white`
- **Content area:** `p-6 flex flex-col flex-grow`
  - Tags: `flex flex-wrap gap-2 mb-3` — setiap tag `text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-dark rounded-lg text-gray-500`
  - Judul: `text-lg font-bold text-white group-hover:text-primary transition-colors`
  - Deskripsi: `text-sm text-gray-500 leading-relaxed mt-2`

#### 5.2 Layout Section Gallery:

1. **Header section:** (centered)
   - Label: `"MY PORTFOLIO"` — styling sama seperti section label sebelumnya
   - Heading: `"Featured Design Works"` — `text-3xl md:text-5xl font-display font-bold text-white mb-6`
   - Sub-text: penjelasan singkat — `text-gray-400 max-w-2xl mx-auto text-lg`

2. **Filter tabs** (opsional tapi recommended):
   - Tombol filter: `All`, `Branding`, `Illustration`, `Social Media`, `Print`, `UI/UX`
   - Styling: `px-6 py-2 rounded-full text-sm font-medium transition-all`
   - Active: `bg-primary text-white`
   - Inactive: `text-gray-400 hover:text-white hover:bg-dark-card`
   - Gunakan state React untuk filter category

3. **Grid karya:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`

4. **Link "View All"** di bawah grid:
   - `"View all projects"` + ikon ArrowRight
   - `text-primary font-bold hover:underline`

---

### 6. Section: Contact (`src/sections/Contact.jsx`)

**Tujuan:** Memberikan cara mudah bagi orang lain untuk menghubungi Muhammad Zaqly Luluang.

#### Spesifikasi Layout:

- **Background:** `bg-dark-card/50`
- **Padding:** `py-20 md:py-28`
- **Layout:** 2 kolom di desktop (info kiri 1/3, form kanan 2/3), stack di mobile

#### Konten Kolom Kiri — Info Kontak:

1. **Item info (3 item):**
   - Email: ikon Mail (Lucide) + `zaqly@example.com`
   - Phone: ikon Phone + `+62 812 3456 7890`
   - Location: ikon MapPin + `Gorontalo, Indonesia`
   - Styling per item: ikon dalam `bg-primary/10 p-4 rounded-2xl text-primary`, teks `text-white font-bold` + detail `text-gray-400`

2. **Card "Available for Work":**
   - `p-8 bg-dark-card rounded-3xl border border-dark-border`
   - Heading: `"Available for Freelance"` — `text-xl font-bold text-white`
   - Sub: `"I'm currently accepting new design projects and collaborations."` — `text-gray-400 text-sm`
   - Indikator hijau: `w-3 h-3 bg-green-500 rounded-full animate-pulse` inline di heading

#### Konten Kolom Kanan — Form Kontak:

- **Container:** `bg-dark-card p-8 md:p-12 rounded-3xl border border-dark-border`
- **Fields:**
  - Row 1 (2 kolom): Name + Email
  - Row 2 (1 kolom): Subject
  - Row 3 (1 kolom): Message (textarea, `h-40 resize-none`)
- **Styling input:** `w-full px-6 py-4 bg-dark border border-dark-border focus:border-primary outline-none rounded-xl transition-all text-white placeholder:text-gray-600`
- **Label:** `text-sm font-bold text-gray-300 mb-2`
- **Submit button:** `bg-primary hover:bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all` + ikon Send (Lucide)
- **Validasi:** HTML5 `required` attribute pada semua fields
- **`onSubmit`:** `e.preventDefault()` (placeholder, belum connect ke backend)

---

### 7. Responsive & Animasi

**Tujuan:** Memastikan website tampil sempurna di semua ukuran layar dan memberikan pengalaman interaktif yang premium.

#### 7.1 Responsive Design:

- **Mobile (< 640px):**
  - Semua layout jadi single column
  - Font heading dikecilkan (`text-3xl` → `text-4xl` max)
  - Padding dikurangi (`px-4` daripada `px-6`)
  - Navbar: hamburger menu
  - Gallery: 1 kolom grid
  - Contact form: single column inputs

- **Tablet (640px - 1024px):**
  - Gallery: 2 kolom grid
  - Hero: masih bisa 2 kolom tapi lebih compact
  - About: 2 kolom

- **Desktop (> 1024px):**
  - Full 2-3 kolom layout
  - Gallery: 3 kolom
  - Max-width container: `max-w-7xl mx-auto`

#### 7.2 Animasi & Transisi:

Semua animasi harus **halus, subtle, dan profesional** — JANGAN berlebihan.

1. **Scroll Reveal Animation:**
   - Buat custom hook `useScrollReveal` atau gunakan `IntersectionObserver`
   - Setiap section/elemen muncul dengan fade-in + slide-up saat masuk viewport
   - Delay bertahap untuk elemen berurutan (stagger effect)

2. **Hover Effects:**
   - Semua link: `transition-colors duration-300`
   - Card project: image scale 110% + overlay fade-in (sudah di-spec di atas)
   - Buttons: scale 105% + shadow lebih kuat — `hover:scale-105 hover:shadow-xl transition-all duration-300`
   - Skill badges: border berubah warna + teks berubah warna

3. **Micro-interactions:**
   - Navbar background transition saat scroll
   - CTA button arrow → translate-x saat hover
   - Dark mode toggle: rotasi ikon 180°
   - Social media icons: scale + color change

4. **Page transitions:**
   - Smooth scroll antar section
   - Loading state: skeleton atau simple fade-in saat pertama load

---

### 8. Integrasi Gambar dari Google Drive

**Tujuan:** Mengambil dan menampilkan karya-karya art dari Google Drive folder "My art".

#### Langkah-langkah:

1. **Akses Google Drive folder "My art"** milik Muhammad Zaqly Luluang
2. **Download semua gambar** dari folder tersebut
3. **Simpan gambar** ke `public/gallery/` dengan penamaan:
   - `project1.jpg`, `project2.jpg`, dst.
   - Atau gunakan nama deskriptif: `brand-identity.jpg`, `social-media-campaign.jpg`, dst.
4. **Optimasi gambar:**
   - Resize ke max 1200px width untuk web
   - Compress menggunakan format WebP jika memungkinkan
   - Buat thumbnail versi kecil (400x300) jika diperlukan untuk loading cepat
5. **Update `src/data/projects.js`** dengan path gambar yang benar
6. **Jika folder Google Drive tidak bisa diakses:**
   - Gunakan placeholder images sementara
   - Tambahkan komentar `// TODO: Replace with actual images from Google Drive "My art" folder`

---

### 9. Assembly & App.jsx

**Tujuan:** Menyatukan semua komponen dan section.

#### File `src/App.jsx`:

```jsx
import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Gallery from './sections/Gallery';
import Contact from './sections/Contact';

function App() {
  return (
    <div className="min-h-screen bg-dark text-light">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
```

---

### 10. Build & Verifikasi

**Tujuan:** Memastikan project bisa di-build tanpa error dan siap deploy.

1. **Run dev server:** `npm run dev` — pastikan tidak ada error di console
2. **Cek semua section** muncul dan berfungsi dengan benar
3. **Test responsive:** resize browser ke mobile/tablet/desktop
4. **Test dark mode toggle:** pastikan warna berubah di semua elemen
5. **Test animasi:** scroll dan lihat apakah animasi berjalan smooth
6. **Build production:** `npm run build` — pastikan 0 error
7. **Preview build:** `npm run preview` — cek hasil build final

---

## Catatan Penting

- Semua referensi "EMZEDEL" harus diganti menjadi **"Muhammad Zaqly Luluang"** di seluruh codebase
- Desain default menggunakan **dark theme** (futuristik) dengan opsi light mode via toggle
- Palet warna utama: **Indigo (#6366f1)** + **Cyan (#06b6d4)** — memberikan kesan futuristik dan premium
- Font utama: **Inter** (body text) + **Outfit** (headings/display)
- Semua konten dummy bisa diganti nanti — fokus dulu ke implementasi UI yang sempurna
- Gambar karya **wajib** diambil dari Google Drive "My art" folder. Jika tidak bisa diakses, gunakan placeholder dan beri komentar TODO
- Pastikan `node_modules/` dan file build tidak masuk ke git (cek `.gitignore`)
