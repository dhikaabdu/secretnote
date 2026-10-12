# SecretNote — Aplikasi Catatan Digital Privat

## 1. Deskripsi Produk

SecretNote adalah aplikasi web untuk membuat dan mengelola catatan digital berdasarkan kategori. Proyek ini dikembangkan sebagai proyek terpadu untuk mata kuliah Pengembangan Aplikasi Web, Kriptografi, dan Keamanan Komputasi dan Siber.

Versi awal berfokus pada antarmuka pengguna, navigasi halaman, data contoh, serta validasi formulir. Fitur penyimpanan permanen dan perlindungan kriptografi akan dikembangkan secara bertahap sesuai ruang lingkup tugas perkuliahan.

## 2. Tujuan dan Target Pengguna

**Tujuan:** menyediakan tempat terorganisasi untuk membuat dan mengelola catatan digital.

**Target pengguna:**
- Mahasiswa yang ingin mengelola catatan akademik.
- Pengguna umum yang ingin mengelola catatan pribadi dan daftar pekerjaan.

**Masalah yang ditangani:** catatan digital dapat memuat informasi pribadi sehingga perlu dikelola dengan baik dan dirancang dengan mempertimbangkan aspek keamanan.

## 3. Fitur Aplikasi

Fitur yang tersedia pada versi awal:
- Dashboard dengan ringkasan catatan.
- Halaman daftar catatan.
- Halaman pembuatan catatan baru.
- Pengelompokan catatan berdasarkan kategori.
- Komponen kartu catatan yang dapat digunakan kembali.
- Validasi formulir pada sisi klien untuk judul dan isi catatan.
- Pesan kesalahan ketika input wajib belum diisi.
- Navigasi ant halaman.
- Tampilan yang dirancang agar dapat dikembangkan untuk berbagai ukuran layar.

**Batasan versi awal:** data yang ditampilkan masih berupa data contoh. Formulir saat ini memvalidasi input dan belum menyimpan catatan secara permanen.

## 4. Teknologi yang Digunakan

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Node.js dan npm untuk menjalankan lingkungan pengembangan
- Git dan GitHub untuk pengelolaan versi kode

## 5. Struktur Proyek

```text
secretnote/
├── app/
│   ├── notes/
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AppHeader.tsx
│   ├── CategoryBadge.tsx
│   ├── FormField.tsx
│   ├── NoteCard.tsx
│   └── PageHeader.tsx
├── public/
├── AI_LOG.md
├── package.json
└── README.md
```

## 6. Cara Menjalankan Aplikasi

### Prasyarat

Pastikan Node.js dan npm sudah terpasang di komputer.

### Instalasi dan menjalankan

1. Buka terminal pada folder proyek.
2. Jalankan perintah berikut untuk memasang dependensi:

```bash
npm install
```

3. Jalankan server pengembangan:

```bash
npm run dev
```

4. Buka browser dan akses:

```text
http://localhost:3000
```

Untuk menghentikan server, tekan `Ctrl + C` pada terminal.

## 7. Pengujian

Pengujian versi awal mencakup:
- Pemeriksaan navigasi dashboard, daftar catatan, dan halaman catatan baru.
- Pemeriksaan validasi ketika judul atau isi catatan kosong.
- Pemeriksaan tampilan pada ukuran mobile, tablet, dan desktop.
- Pengukuran aksesibilitas menggunakan Lighthouse.

Hasil pengujian dan skor Lighthouse akan dicatat berdasarkan pengujian aktual. Target skor Accessibility adalah minimal 85.

## 8. Pengembangan Selanjutnya

Pengembangan berikutnya dapat mencakup:
- Penyimpanan catatan secara permanen.
- Pengujian komponen kriptografi untuk melindungi isi catatan.
- Pemodelan ancaman dan pencatatan risiko keamanan.
- Peningkatan aksesibilitas dan pengalaman pengguna.

Fitur tersebut hanya akan dinyatakan tersedia setelah implementasi dan pengujiannya selesai.

## 9. Proyek Terpadu Mata Kuliah

SecretNote merupakan proyek individual yang dikembangkan secara bertahap untuk tiga mata kuliah:

1. **Pengembangan Aplikasi Web:** antarmuka, navigasi, komponen reusable, validasi formulir, responsivitas, dan aksesibilitas.
2. **Kriptografi:** perancangan, implementasi, dan pengujian komponen kriptografi.
3. **Keamanan Komputasi dan Siber:** inventaris aset, Data Flow Diagram (DFD), pemodelan ancaman STRIDE, serta register risiko.

Setiap artefak tugas akan ditambahkan ke repositori sesuai ketentuan dan tahapan pengumpulan masing-masing mata kuliah.

## 10. Catatan Penggunaan AI

Penggunaan AI dalam pengembangan dan dokumentasi dicatat pada file `AI_LOG.md`. Kode dan dokumentasi ditinjau serta diuji oleh pengembang sebelum digunakan sebagai hasil pengumpulan.

## Bukti Pengujian Formulir

Pengujian validasi formulir dilakukan pada halaman pembuatan catatan baru.

- **Validasi gagal:** ketika judul dan isi catatan tidak diisi, aplikasi menampilkan pesan kesalahan pada masing-masing kolom.
- **Validasi berhasil:** ketika judul dan isi catatan telah diisi, aplikasi menampilkan pesan bahwa validasi berhasil. Pada versi awal, catatan belum disimpan secara permanen.

Bukti pengujian:
- `docs/evidence/form-validation-empty.png`
- `docs/evidence/form-validation-success.png`
