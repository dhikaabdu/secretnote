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

## 4. Kebutuhan Keamanan dan Kriptografi

SecretNote dirancang untuk mengelola catatan digital yang berpotensi memuat informasi pribadi. Komponen kriptografi awal menggunakan AES-256-GCM untuk melindungi kerahasiaan dan integritas data yang diproses oleh komponen tersebut.

| Data yang Dilindungi | Tujuan Keamanan | Prioritas |
|---|---|---|
| Isi catatan pribadi | Menjaga kerahasiaan isi catatan melalui enkripsi dan mendeteksi perubahan data melalui autentikasi | Tinggi |
| Kunci enkripsi | Menjaga kerahasiaan kunci agar hanya komponen yang berwenang yang dapat menggunakannya | Tinggi |
| Metadata catatan, seperti judul dan kategori | Mengidentifikasi metadata yang berpotensi mengungkapkan informasi pengguna dan menentukan kebutuhan perlindungannya | Sedang |

Prioritas di atas merupakan prioritas rancangan awal, bukan hasil penilaian risiko formal.

**Batasan perlindungan:** komponen kriptografi yang tersedia saat ini dapat mengenkripsi dan mendekripsi teks menggunakan kunci yang diberikan. Penyimpanan permanen, pengelolaan kunci, dan integrasi enkripsi ke dalam penyimpanan catatan aplikasi belum diimplementasikan.

## 5. Rancangan Komponen Kriptografi

### 5.1 Algoritma

Komponen menggunakan AES-256-GCM melalui modul bawaan `node:crypto`. AES-256-GCM merupakan algoritma enkripsi terautentikasi yang memberikan kerahasiaan serta pemeriksaan integritas dan autentikasi data.

### 5.2 Masukan, proses, dan keluaran

| Tahapan | Deskripsi |
|---|---|
| Masukan enkripsi | Teks catatan dan kunci berukuran 32 byte (256 bit) |
| Proses enkripsi | Membuat nonce acak 12 byte, menjalankan AES-256-GCM, dan menghasilkan authentication tag |
| Keluaran enkripsi | Objek berisi versi format, nama algoritma, nonce, ciphertext, dan tag |
| Masukan dekripsi | Objek data terenkripsi dan kunci yang sama |
| Proses dekripsi | Memvalidasi format, mengatur authentication tag, dan memverifikasi autentikasi ketika dekripsi dilakukan |
| Keluaran dekripsi | Teks asli jika autentikasi berhasil; proses gagal jika autentikasi tidak valid |

### 5.3 Representasi data

Objek `EncryptedNote` menggunakan struktur berikut:

- `version`: versi format data, saat ini `1`.
- `algorithm`: algoritma yang digunakan, yaitu `aes-256-gcm`.
- `nonce`: nonce 12 byte yang direpresentasikan dalam Base64.
- `ciphertext`: hasil enkripsi yang direpresentasikan dalam Base64.
- `tag`: authentication tag 16 byte yang direpresentasikan dalam Base64.

Base64 merupakan representasi data biner dalam bentuk teks, bukan mekanisme enkripsi.

### 5.4 Sumber keacakan dan pengelolaan kunci

Komponen menggunakan `randomBytes()` dari modul `node:crypto` untuk menghasilkan kunci enkripsi dan nonce. Setiap operasi enkripsi menghasilkan nonce baru secara acak. Nonce tidak harus dirahasiakan, tetapi tidak boleh digunakan kembali dengan kunci yang sama pada AES-GCM.

Kunci AES-256 memiliki panjang 32 byte dan harus dijaga kerahasiaannya. Kunci tidak boleh disimpan bersama ciphertext atau diunggah ke repository. Pengelolaan kunci secara persisten dan integrasinya dengan aplikasi belum termasuk implementasi saat ini.

### 5.5 Batasan komponen

Komponen ini merupakan implementasi dasar yang berdiri sendiri. Komponen belum diintegrasikan dengan formulir pembuatan catatan, penyimpanan permanen, autentikasi pengguna, atau mekanisme pengelolaan kunci. Oleh karena itu, implementasi ini belum menyatakan bahwa seluruh data catatan dalam aplikasi telah terlindungi secara kriptografis.

## 6. Pengujian Otomatis Kriptografi

Pengujian otomatis menggunakan modul bawaan `node:test` dan `node:assert/strict`. Skenario yang telah dijalankan meliputi:

| No. | Skenario | Hasil |
|---|---|---|
| 1 | Enkripsi dan dekripsi catatan normal | Lulus |
| 2 | Enkripsi dan dekripsi catatan kosong | Lulus |
| 3 | Enkripsi menghasilkan nonce berbeda | Lulus |
| 4 | Dekripsi menggunakan kunci yang salah | Lulus |
| 5 | Dekripsi ciphertext yang diubah | Lulus |

**Hasil pengujian aktual:** 5 tes berhasil dan 0 tes gagal pada eksekusi `npm run test:crypto` tanggal 12 Oktober 2026.

### Cara menjalankan pengujian

Pastikan Node.js sudah terpasang, lalu jalankan:

```bash
npm install
npm run test:crypto
```

Perintah pengujian menjalankan file `tests/crypto.test.ts` dengan dukungan pemrosesan TypeScript bawaan Node.js.

Hasil pengujian di atas menunjukkan bahwa lima skenario tersebut lulus pada saat dijalankan. Hasil tersebut tidak membuktikan bahwa seluruh aplikasi telah menerapkan enkripsi secara menyeluruh.

## 7. Teknologi yang Digunakan

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Node.js dan npm
- Modul bawaan Node.js `node:crypto`
- Modul bawaan Node.js `node:test`
- Git dan GitHub untuk pengelolaan versi kode

## 8. Struktur Proyek

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
├── lib/
│   └── crypto.ts
├── tests/
│   └── crypto.test.ts
├── docs/
│   └── evidence/
├── AI_LOG.md
├── package.json
└── README.md
```

## 9. Cara Menjalankan Aplikasi

### Prasyarat

Pastikan Node.js dan npm sudah terpasang di komputer.

### Instalasi dan menjalankan

1. Buka terminal pada folder proyek.
2. Pasang dependensi:

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

Untuk menjalankan pengujian kriptografi, gunakan:

```bash
npm run test:crypto
```



## 5. Teknologi yang Digunakan

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Node.js dan npm untuk menjalankan lingkungan pengembangan
- Git dan GitHub untuk pengelolaan versi kode

## 6. Struktur Proyek

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

## 7. Cara Menjalankan Aplikasi

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

## 8. Pengujian

Pengujian versi awal mencakup:
- Pemeriksaan navigasi dashboard, daftar catatan, dan halaman catatan baru.
- Pemeriksaan validasi ketika judul atau isi catatan kosong.
- Pemeriksaan tampilan pada ukuran mobile, tablet, dan desktop.
- Pengukuran aksesibilitas menggunakan Lighthouse.

Hasil pengujian dan skor Lighthouse akan dicatat berdasarkan pengujian aktual. Target skor Accessibility adalah minimal 85.

## 9. Pengembangan Selanjutnya

Pengembangan berikutnya dapat mencakup:
- Penyimpanan catatan secara permanen.
- Pengujian komponen kriptografi untuk melindungi isi catatan.
- Pemodelan ancaman dan pencatatan risiko keamanan.
- Peningkatan aksesibilitas dan pengalaman pengguna.

Fitur tersebut hanya akan dinyatakan tersedia setelah implementasi dan pengujiannya selesai.

## 10. Proyek Terpadu Mata Kuliah

SecretNote merupakan proyek individual yang dikembangkan secara bertahap untuk tiga mata kuliah:

1. **Pengembangan Aplikasi Web:** antarmuka, navigasi, komponen reusable, validasi formulir, responsivitas, dan aksesibilitas.
2. **Kriptografi:** perancangan, implementasi, dan pengujian komponen kriptografi.
3. **Keamanan Komputasi dan Siber:** inventaris aset, Data Flow Diagram (DFD), pemodelan ancaman STRIDE, serta register risiko.

Setiap artefak tugas akan ditambahkan ke repositori sesuai ketentuan dan tahapan pengumpulan masing-masing mata kuliah.

## 11. Catatan Penggunaan AI

Penggunaan AI dalam pengembangan dan dokumentasi dicatat pada file `AI_LOG.md`. Kode dan dokumentasi ditinjau serta diuji oleh pengembang sebelum digunakan sebagai hasil pengumpulan.

## Bukti Pengujian Formulir

Pengujian validasi formulir dilakukan pada halaman pembuatan catatan baru.

- **Validasi gagal:** ketika judul dan isi catatan tidak diisi, aplikasi menampilkan pesan kesalahan pada masing-masing kolom.
- **Validasi berhasil:** ketika judul dan isi catatan telah diisi, aplikasi menampilkan pesan bahwa validasi berhasil. Pada versi awal, catatan belum disimpan secara permanen.

Bukti pengujian:
- `docs/evidence/form-validation-empty.png`
- `docs/evidence/form-validation-success.png`

### Hasil Pengujian Lighthouse

Pengujian aksesibilitas dilakukan menggunakan Lighthouse pada aplikasi SecretNote yang dijalankan secara lokal.

| Parameter | Hasil |
|---|---|
| Kategori audit | Accessibility |
| Skor | 95/100 |
| Target tugas | Minimal 85 |
| Status | Memenuhi target skor |
| Versi Lighthouse | 13.4.1 |
| Browser | Chromium 154.0.0.0 |
| Tanggal pengujian | 12 Oktober 2026 |

**Temuan:** Lighthouse menampilkan peringatan terkait rasio kontras warna latar dan teks. Temuan tersebut perlu ditinjau untuk meningkatkan keterbacaan antarmuka.

**Bukti pengujian:**
- Screenshot: `docs/evidence/lighthouse-accessibility-desktop.png`
- Laporan lengkap: `docs/evidence/laporan-lighthouse-secretnote.pdf`