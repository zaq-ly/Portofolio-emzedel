# Prompt untuk Melanjutkan Project

Copy-paste salah satu prompt di bawah ini ke conversation baru.

---

## Prompt Singkat (Recommended)

```
Baca file `PROJECT_BRIEF.md` di root project `d:\Projects\Portofolio EMZEDEL`. File itu berisi semua konteks, keputusan desain, tech stack, dan checklist tugas yang perlu dikerjakan.

Setelah membacanya, kerjakan task yang ada di checklist "High Priority" secara berurutan. Mulai dari yang paling atas. Tanyakan jika ada yang kurang jelas.
```

---

## Prompt Lengkap (Kalau model tidak bisa baca file otomatis)

```
Saya sedang membangun website portfolio pribadi dengan React + Vite + Tailwind CSS + Framer Motion. Backend menggunakan Supabase. Desainnya bergaya Apple (minimalis, tipografi besar, banyak whitespace).

Project ada di: d:\Projects\Portofolio EMZEDEL

Baca file PROJECT_BRIEF.md di root project untuk konteks lengkap. Itu berisi:
- Tech stack dan versi
- Konsep desain Apple-style (warna, font, animasi)
- Struktur halaman dan routing
- Konfigurasi Supabase (tabel, storage bucket)
- Keputusan konten hasil diskusi
- Checklist tugas yang belum selesai

Tugas yang perlu dikerjakan (prioritas tinggi):
1. Test upload project via admin — pastikan Supabase terhubung
2. Migrasi PENUH ke Supabase — buatkan script untuk upload 80+ gambar dari public/gallery/ ke Supabase Storage dan import data dari src/data/projects.js ke tabel
3. Buat halaman /gallery — halaman terpisah untuk semua karya desain dengan filter kategori dan lightbox
4. Update section Projects di halaman utama — hanya tampilkan IT Dev projects + 4-6 karya visual terbaik + tombol "Lihat Semua" yang mengarah ke /gallery
5. Review responsive mobile

Kerjakan berurutan dari nomor 1. Tanyakan jika ada yang kurang jelas.
```
