# AI Usage Log — SecretNote

## 1. Penggunaan AI

- **Alat:** ChatGPT
- **Tujuan:** Membantu memahami persyaratan tugas, menyusun dokumentasi proyek, dan memberikan panduan pengembangan.
- **Ringkasan prompt:** Meminta panduan membangun proyek SecretNote dari awal, memeriksa struktur proyek, dan menyiapkan dokumentasi sesuai ketentuan tiga mata kuliah Pengembangan Aplikasi Web, Keamanan Komputasi Dan Siber, dan Kriptografi


## 2. Bagian yang Dibantu

- Dokumentasi deskripsi produk dan teknologi pada README.
- Perencanaan fitur aplikasi dan struktur proyek.
- Panduan penggunaan Git dan GitHub.

## 3. Perubahan oleh Pengembang

Pengembang meninjau dan menerapkan perubahan pada proyek secara bertahap melalui Visual Studio Code.

## 4. Verifikasi

Verifikasi dilakukan dengan menjalankan aplikasi secara lokal, memeriksa tampilan halaman melalui browser, dan memeriksa hasil perintah di terminal.

## 5. Catatan

Log ini akan diperbarui apabila AI digunakan untuk membantu implementasi komponen kriptografi, pengujian, atau dokumentasi keamanan.

Implementasi dan hasil pengujian yang belum dilakukan tidak dinyatakan sebagai fitur yang telah selesai.
## 6. Implementasi Kriptografi — Tugas 1

- **Alat:** ChatGPT.
- **Tujuan:** Membantu memahami persyaratan tugas Kriptografi, menyusun rancangan komponen AES-256-GCM, dan merancang pengujian otomatis.
- **Ringkasan prompt:** Meminta panduan implementasi enkripsi dan dekripsi AES-256-GCM pada proyek SecretNote, penyusunan pengujian otomatis, dan pelengkapan dokumentasi.
- **Bagian yang dibantu:** Kode awal `lib/crypto.ts`, skenario pengujian `tests/crypto.test.ts`, penambahan perintah `test:crypto` pada `package.json`, dan rancangan dokumentasi `README.md`.
- **Perubahan dan pemeriksaan oleh pengembang:** Kode disalin dan disimpan melalui Visual Studio Code, kemudian pengujian dijalankan melalui terminal PowerShell.
- **Cara verifikasi:** Menjalankan `npm run test:crypto` menggunakan Node.js v26.7.0.
- **Hasil verifikasi:** Lima skenario pengujian berhasil dan nol pengujian gagal pada eksekusi yang diperiksa tanggal 12 Oktober 2026.
- **Batasan implementasi:** Komponen kriptografi belum diintegrasikan ke penyimpanan catatan permanen. Pengelolaan kunci dan perlindungan kriptografi menyeluruh pada aplikasi belum selesai.

Catatan ini harus ditinjau oleh pengembang dan disesuaikan jika terdapat perubahan kode atau hasil pengujian berikutnya.
