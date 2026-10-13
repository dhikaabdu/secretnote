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

## 7. Dokumentasi Keamanan Siber — Tugas Berikutnya

- **Alat:** ChatGPT.
- **Tujuan:** Membantu menyusun dokumentasi inventaris aset, Data Flow Diagram (DFD), pemodelan ancaman STRIDE, dan register risiko untuk proyek SecretNote.
- **Ringkasan prompt:** Meminta panduan untuk memperbarui atau membuat `asset-inventory.md`, `dfd.md`, `threat-model.md`, dan `risk-register.md` berdasarkan implementasi produk yang berjalan serta ketentuan tugas Keamanan Komputasi dan Siber.
- **Bagian yang dibantu:** Penyusunan inventaris aset, identifikasi elemen dan aliran data, identifikasi ancaman STRIDE, penilaian awal kemungkinan dan dampak risiko, serta rancangan kontrol mitigasi.
- **Dasar analisis:** Pemeriksaan `README.md`, `app/page.tsx`, `app/notes/page.tsx`, `app/notes/new/page.tsx`, dan `lib/crypto.ts`.
- **Batasan:** Penilaian risiko merupakan estimasi awal. Ancaman yang belum diuji tidak dinyatakan sebagai kerentanan yang terbukti. Kontrol mitigasi yang belum diterapkan tidak dinyatakan telah selesai.
- **Verifikasi:** Dokumen diperiksa melalui Visual Studio Code dan PowerShell. Pemeriksaan akhir, commit, dan pembuatan tag `sec-0.1` dilakukan setelah seluruh dokumen selesai ditinjau.

Catatan ini harus ditinjau dan diperbarui oleh pengembang sesuai perubahan aktual dan hasil verifikasi akhir.