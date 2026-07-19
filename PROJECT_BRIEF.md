# 📋 Project Brief — Portofolio EMZEDEL

> Gunakan file ini sebagai konteks awal saat memulai conversation baru.
> Cukup paste isi file ini atau rujuk file ini di awal prompt.

---

## 🎯 Tujuan Project

Membangun website portfolio pribadi untuk **Muhammad Zaqly Luluang** (alias EMZEDEL), seorang **Creative Developer** dengan latar belakang desain grafis, ilustrasi digital, dan front-end development. Website ini akan dilihat oleh **rekruter perusahaan**.

---

## 🏗️ Tech Stack

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| React | 19.x | UI Framework |
| Vite | 8.x | Build tool |
| Tailwind CSS | 3.4.x | Styling |
| Framer Motion | 12.x | Animasi (scroll-trigger, parallax, text reveal) |
| Supabase | Latest | Database + Image Storage (backend admin) |
| Lucide React | Latest | Ikon |
| React Router DOM | 7.x | Routing |

---

## 🎨 Konsep Desain: Apple-Style

Website ini mengikuti bahasa desain Apple (apple.com):

### Prinsip Utama
- **Minimalis** — whitespace yang luas, tanpa elemen dekoratif berlebihan
- **Tipografi besar** — heading 5xl-7xl, tight tracking (-0.02em)
- **Font**: `system-ui` (otomatis San Francisco di Apple devices)
- **Warna**:
  - Background utama: `#f5f5f7` (abu-abu terang khas Apple)
  - Surface/Card: `#ffffff`
  - Text primary: `#1d1d1f`
  - Text secondary: `#86868b`
  - Accent: `#0071e3` (biru Apple)
  - Border: `#d2d2d7`
- **Shadow**: Sangat halus dan luas (`0 2px 20px rgba(0,0,0,0.06)`)
- **Border radius**: `rounded-3xl` (1.5rem) untuk card besar

### Animasi yang Sudah Diterapkan
1. **Scroll-triggered reveal** — `FadeIn` component (`src/components/animations/FadeIn.jsx`)
   - Cubic-bezier easing: `[0.16, 1, 0.3, 1]` (Apple-like smoothness)
   - Staggered delay untuk grid items
2. **Text reveal kata per kata** — `TextReveal` component (`src/components/animations/TextReveal.jsx`)
   - Digunakan di Hero untuk nama
3. **Parallax image** — Foto profil di Hero bergerak lambat + scale saat scroll
4. **Sticky section** — About section: heading sticky di kiri, konten scroll di kanan
5. **Spring hover** — Project cards membesar + gambar zoom saat hover

---

## 📐 Struktur Halaman (Sections)

```
/ (Main Portfolio — fokus Front-End Dev)
├── Navbar         — Thin glassmorphism bar, link navigasi kecil
├── Hero           — Nama besar di tengah, tagline, CTA, foto profil
├── About          — Sticky heading kiri + scrolling content kanan
├── Skills         — Bento grid 3 kolom (Front-End, UI/UX, Design)
├── Projects       — IT Development projects (card besar, deskripsi + tech stack)
├── Karya Visual   — HANYA 4-6 thumbnail terbaik + tombol "Lihat Semua →" ke /gallery
├── Experience     — List vertikal sederhana (tahun | judul | deskripsi)
├── Contact        — Grid 2x2 card kontak (Email, GitHub, LinkedIn, Instagram)
└── Footer         — Minimalis, link sosmed teks, copyright

/gallery (Halaman Terpisah — Galeri Lengkap Karya Desain)
├── Header         — Judul + filter kategori (Ilustrasi, Logo, Vector, Poster, dll)
├── Grid           — Masonry/bento grid semua 80+ karya desain
└── Lightbox       — Modal preview saat gambar diklik

/admin             — Login page
/admin/dashboard   — Dashboard CRUD projects
```

---

## 📊 Keputusan Konten (Hasil Diskusi)

### Yang ditampilkan di halaman utama (/):
- **IT Development projects** — tampil utama (card besar dengan deskripsi + tech stack + link)
- **Karya Visual (pendukung)** — HANYA 4-6 gambar terbaik sebagai teaser, dengan link ke /gallery
- **Skills** — 3 pilar: Front-End Dev, UI/UX Design, Design & Ilustrasi
- **Experience** — Riwayat pendidikan dan pengalaman (hardcoded)

### Yang ditampilkan di halaman galeri (/gallery):
- **Semua 80+ karya desain/ilustrasi** — grid lengkap dengan filter kategori
- Halaman ini terpisah agar tidak membuat halaman utama terlalu berat
- **About** — Cerita perjalanan kreatif (hardcoded)

### Yang TIDAK ditampilkan:
- Sertifikat (tidak ada yang relevan)
- Organisasi
- Pencapaian formal
- Section terpisah untuk sertifikat/organisasi

### Catatan penting:
- Project tugas kuliah **boleh ditampilkan**, tapi JANGAN tulis "tugas kuliah" — tulis apa yang dibuat dan tech stack-nya
- Design/ilustrasi **tetap ada** tapi porsinya lebih kecil dari IT projects
- Untuk project web: upload **screenshot** + sertakan **link live demo dan GitHub**

---

## 🗄️ Supabase Configuration

### Database
- **Project URL**: `https://tshzvjlqrwfncgceindf.supabase.co`
- **Region**: Northeast Asia (Tokyo)

### Tabel: `projects`
```sql
CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'illustration',
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Storage Bucket
- Nama: `project-images` (Public bucket)

### Kategori yang tersedia:
- `frontend` — Front-End Project
- `uiux` — UI/UX Project
- `illustration` — Ilustrasi
- `logo` — Logo
- `vector` — Vector
- `poster` — Poster
- `banner` — Banner

---

## 📁 Struktur File Penting

```
src/
├── components/
│   ├── animations/
│   │   ├── FadeIn.jsx          # Reusable fade+slide on scroll
│   │   └── TextReveal.jsx      # Word-by-word text reveal
│   ├── Navbar.jsx              # Apple-style thin glass navbar
│   ├── Footer.jsx              # Minimal footer
│   ├── ProjectCard.jsx         # Card project dengan hover effects
│   ├── ImageModal.jsx          # Lightbox modal untuk gambar
│   └── admin/
│       └── ProtectedRoute.jsx  # Auth guard untuk admin
├── sections/
│   ├── Hero.jsx                # Landing section dengan TextReveal + Parallax
│   ├── About.jsx               # Sticky left + scrolling right layout
│   ├── Skills.jsx              # Bento grid 3 kolom
│   ├── Projects.jsx            # IT Dev (utama) + Design (pendukung)
│   ├── Experience.jsx          # List vertikal timeline
│   ├── Contact.jsx             # Grid card kontak
│   └── Gallery.jsx             # (ada tapi belum dipakai di App.jsx)
├── pages/admin/
│   ├── Login.jsx               # Apple-style login
│   └── Dashboard.jsx           # Apple-style CRUD dashboard
├── lib/
│   ├── supabaseClient.js       # Supabase client init
│   └── projectsService.js      # CRUD operations via Supabase
├── data/
│   ├── projects.js             # Static fallback data (80+ karya)
│   └── experience.js           # Hardcoded experience data
├── utils/
│   ├── projects.js             # Transform snake_case ke camelCase
│   └── image.js                # Image optimization helper
├── App.jsx                     # Router + layout
├── main.jsx                    # Entry point
└── index.css                   # Global styles + Tailwind layers
```

---

## Yang Masih Perlu Dikerjakan / Di-review

### High Priority
- [ ] **Test upload project via admin** — pastikan koneksi Supabase benar
- [ ] **Migrasi PENUH ke Supabase (Opsi A)** — upload semua 80+ gambar dari `public/gallery/` ke Supabase Storage, import data ke tabel, lalu hapus file lokal. Buatkan script migrasi otomatis.
- [ ] **Buat halaman /gallery** — halaman terpisah untuk menampilkan semua karya desain/ilustrasi dengan filter kategori dan lightbox
- [ ] **Update Projects section di halaman utama** — hanya tampilkan IT Dev projects + 4-6 karya visual terbaik + tombol "Lihat Semua" ke /gallery
- [ ] **Review responsive mobile** — pastikan semua section terlihat baik di mobile
- [ ] **Polish animasi** — fine-tune timing/easing jika perlu

### Medium Priority
- [ ] **Struktur Projects section** — IT Dev ditampilkan dulu (card besar), Design di bawahnya (galeri ringkas/grid kecil)
- [ ] **SEO** — meta tags, og:image, title per section
- [ ] **Performance** — lazy loading gambar, code splitting
- [ ] **Dark mode** (opsional, tapi Apple-like)

### Low Priority
- [ ] **Download CV (PDF)** — link download di Hero atau About
- [ ] **Gallery section** — ada file `Gallery.jsx` tapi belum dipakai
- [ ] **Admin: bulk upload** — import banyak project sekaligus
- [ ] **Admin: reorder projects** — drag dan drop urutan

---

## 🔑 Environment Variables (.env)

```
VITE_SUPABASE_URL=https://tshzvjlqrwfncgceindf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...(rahasia)
VITE_ADMIN_PASSWORD=(password admin pilihan user)
```

---

## 💡 Konteks Tambahan

- User adalah mahasiswa yang skill utamanya di **desain dan ilustrasi**
- User menggunakan **AI (prompting)** untuk coding — ini valid dan tidak perlu disembunyikan
- Website di-deploy di **Netlify** (ada file `_redirects` di public/)
- Framer Motion sudah terinstall dan digunakan — **jangan ganti ke GSAP**
- Admin saat ini hanya untuk **mengelola projects** (CRUD) — konten lain (About, Skills, Experience) tetap hardcoded

---

## 🚀 Cara Menjalankan

```bash
# Development
npm run dev

# Build
npm run build

# Admin
# Buka http://localhost:5173/admin
```
