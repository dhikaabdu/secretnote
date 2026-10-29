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

## 9. Login Demo dan Session Modul 5

- **Alat:** AI assistant menggunakan Copilot SDK di VS Code.
- **Tujuan:** Mengimplementasikan login demo, session server in-memory, cookie, logout, dan pemeriksaan awal route sesuai scope yang disetujui.
- **Ringkasan prompt:** Meminta implementasi login demo pada Next.js 16.4.0 dengan route catatan terlindungi, dashboard publik, expiry session satu jam, konfigurasi kredensial environment, dan tanpa persistence catatan.
- **Bagian yang dibantu:** Modul autentikasi/session server-only, route login, pemeriksaan session pada page notes, `proxy.ts`, UI login/logout, contoh nama environment tanpa nilai rahasia, tes unit autentikasi, serta pembaruan dokumen Modul 5.
- **Keputusan dan batasan:** Session memakai Map dalam memori untuk demo satu proses; session hilang saat restart dan tidak dibagi antar-instance. Penyimpanan dan kepemilikan catatan tidak ditambahkan. Login belum dapat diverifikasi secara end-to-end sampai pengembang menyiapkan `DEMO_USERNAME` dan `DEMO_PASSWORD` secara lokal.
- **Verifikasi saat tahap autentikasi:** `npm run test:auth` (11 lulus), `npm run test:notes` (9 lulus), `npm run test:crypto` (5 lulus), `npx tsc --noEmit`, dan `npm run lint` berhasil. Request HTTP melalui server development memastikan dashboard publik, route login tersedia, serta route notes menolak tanpa cookie dan cookie palsu tanpa mengirim isi page; redirect pada detail streaming diperiksa melalui penanda `NEXT_REDIRECT`. Build produksi saat itu berhenti dengan `SecurityFatalError` dari Next.js 16.4.0; remediasi versi dan build final kemudian dicatat pada Bagian 11. Pengujian browser, screenshot cookie tersamarkan, login end-to-end dengan kredensial lokal, dan pengujian mandiri dosen tidak diklaim telah dilakukan oleh AI.

## 10. Pemeriksaan respons route terproteksi

- **Alat:** AI assistant menggunakan Copilot SDK di VS Code.
- **Tujuan:** Memverifikasi bahwa respons route notes tidak membocorkan konten prerender saat cookie palsu dikirim.
- **Ringkasan prompt:** Melanjutkan implementasi login/session yang disetujui dan menguji route terproteksi melalui HTTP.
- **Bagian yang dibantu:** Memindahkan pemeriksaan session ke awal setiap page notes, memisahkan Server Component page dari form client pada `/notes/new`, serta menggunakan `connection()` dan `instant = false` pada route terproteksi agar validasi berjalan per-request dan boleh memblokir prerender pada Next.js dengan Cache Components.
- **Temuan dan batasan:** Uji HTTP awal menemukan payload RSC berisi konten contoh walaupun respons mengarahkan ke login. Pemeriksaan ulang pada route daftar dan form tidak menemukan konten page; detail menampilkan redirect marker pada response streaming 200 dan tidak memuat isi catatan. Data contoh yang ada bukan data persisten atau data privat pengguna.
- **Verifikasi saat tahap pemeriksaan route:** TypeScript dan lint lulus; ketiga suite unit lulus. Production build saat itu masih terhalang SecurityFatalError Next.js; hasil sesudah remediasi dicatat pada Bagian 11. Verifikasi HTTP dilakukan dengan server development, bukan browser, dan kredensial login belum diuji end-to-end.

## 11. Remediasi Advisori Keamanan Next.js

- **Alat:** AI assistant menggunakan Copilot SDK di VS Code.
- **Tujuan:** Memeriksa dan menangani `SecurityFatalError` yang menghentikan build produksi pada Next.js 16.4.0.
- **Ringkasan prompt:** Memverifikasi versi dependency, advisori resmi, dampak fitur yang digunakan, lalu menerapkan patch minimum setelah persetujuan pengguna.
- **Bagian yang dibantu:** Audit read-only package manifest/lockfile, verifikasi source advisori resmi Next.js dan React, serta pembaruan `next` dari 16.4.0 ke 16.4.3 dan lockfile. Versi `react`, `react-dom`, dan `eslint-config-next` tidak diubah. Dokumen Modul 5 diperbarui dengan status build terkini.
- **Dasar rekomendasi:** Next.js mengumumkan bahwa 16.4.1 memperbaiki advisory GHSA-673q-mjm6-r5xr, GHSA-2464-fhr4-w9xw, dan GHSA-p3m5-59mp-jv5r. Saat remediasi, npm menandai 16.4.3 sebagai patch `latest` pada minor 16.4.
- **Verifikasi:** `npm run test:auth` (11 lulus), `npm run test:notes` (9 lulus), `npm run test:crypto` (5 lulus), `npx tsc --noEmit`, `npm run lint`, `npm run build`, dan `git diff --check` berhasil. Tes Node menampilkan warning `MODULE_TYPELESS_PACKAGE_JSON` tanpa menggagalkan suite. Proses install melaporkan 0 vulnerabilities; satu script install `unrs-resolver` tidak diizinkan berjalan oleh kebijakan npm saat itu.
- **Batasan:** Tidak ada audit menyeluruh dependency lain, login browser, atau pengujian mandiri mahasiswa. Next.js mengumumkan security release berikutnya untuk 3 November 2026; advisori tersebut belum dipublikasikan saat pemeriksaan ini.

## 8. Implementasi Validasi Formulir Modul 5

- **Alat:** AI assistant menggunakan Copilot SDK di VS Code.
- **Tujuan:** Mengadaptasi validasi server Modul 5 pada formulir catatan SecretNote tanpa mengganti field atau menambahkan penyimpanan baru.
- **Ringkasan prompt:** Memeriksa kode aktual, menerapkan schema Zod 4 dan Server Action dengan `useActionState`, menambahkan pengujian validasi, serta menyusun dokumentasi Modul 5.
- **Bagian yang dibantu:** `lib/skema.ts`, `app/notes/new/actions.ts`, integrasi formulir `/notes/new`, pengujian di `tests/note-action.test.ts`, dan dokumentasi `docs/Praktikum/modul-5.md`.
- **Batasan implementasi:** Source proyek belum memiliki penyimpanan catatan, login, session, cookie, logout, atau `proxy.ts`. Action hanya memvalidasi dan tidak mengklaim catatan telah disimpan.
- **Verifikasi:** `npm run test:notes` lulus dengan 9 tes; `npm run test:crypto` lulus dengan 5 tes; `npx tsc --noEmit`, `npm run lint`, dan `npm run build` selesai tanpa galat. Uji action dilakukan saat dibantu AI, bukan pengujian mandiri mahasiswa. Uji browser dan screenshot belum dilakukan.