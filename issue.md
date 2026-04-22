# Portfolio Website - EMZEDEL

## Deskripsi

Membuat website portfolio personal untuk EMZEDEL (Muhammad Zaqly Luluang) dari scratch menggunakan React JS dan Tailwind CSS. Website ini akan menampilkan profil, skill, project, dan kontak.

## Tech Stack

- **React JS** (via Vite)
- **Tailwind CSS**

---

## Tasks

### 1. Setup Project

- Inisialisasi project React menggunakan Vite di folder ini (`./`)
- Install dan konfigurasi Tailwind CSS
- Bersihkan boilerplate bawaan Vite (hapus contoh code, reset style default)
- Setup struktur folder: `components/`, `assets/`, `sections/`

### 2. Layout & Navigasi

- Buat komponen `Navbar` dengan link navigasi: Home, About, Projects, Contact
- Navbar harus responsive (hamburger menu di mobile)
- Buat komponen `Footer` dengan copyright dan social media links
- Implementasi smooth scroll ke setiap section

### 3. Section: Hero

- Section pembuka dengan nama, tagline/role, dan foto profil
- Tombol CTA (misal: "Lihat Project" atau "Hubungi Saya")
- Animasi sederhana saat pertama kali load

### 4. Section: About

- Deskripsi singkat tentang diri sendiri
- Daftar skill/tech stack yang dikuasai (bisa pakai icon atau badge)
- Layout 2 kolom (foto + teks) di desktop, stack di mobile

### 5. Section: Projects

- Tampilkan daftar project dalam bentuk card grid
- Setiap card berisi: thumbnail, judul, deskripsi singkat, tech yang dipakai, link ke demo/repo
- Minimal 3 project placeholder
- Hover effect pada card

### 6. Section: Contact

- Form kontak sederhana: Nama, Email, Pesan
- Atau tampilkan link ke email, LinkedIn, GitHub
- Validasi form dasar (field required)

### 7. Responsive & Polish

- Pastikan semua section responsive di mobile, tablet, dan desktop
- Tambahkan dark mode toggle (opsional tapi recommended)
- Optimasi performa (lazy load gambar, dsb)

---

## Catatan

- Semua konten bisa pakai data dummy/placeholder dulu, nanti diganti dengan data asli
- Prioritaskan tampilan yang bersih, modern, dan profesional
- Deploy bisa dilakukan setelah semua task selesai (Vercel / Netlify)
