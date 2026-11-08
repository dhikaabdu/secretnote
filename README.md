SecretNote --- Aplikasi Catatan Digital Privat
1. Deskripsi Produk
SecretNote adalah aplikasi web untuk membuat dan mengelola catatan
digital berdasarkan kategori. Proyek ini dikembangkan sebagai proyek
terpadu untuk mata kuliah Pengembangan Aplikasi Web,
Kriptografi, dan Keamanan Komputasi dan Siber.

Pengembangan SecretNote dilakukan secara bertahap, mulai dari antarmuka
dan validasi formulir hingga autentikasi, penyimpanan catatan, serta
komponen kriptografi dan pengelolaan kunci.
2. Tujuan dan Target Pengguna
Tujuan: menyediakan tempat terorganisasi untuk membuat dan mengelola
catatan digital dengan memperhatikan aspek keamanan.

Target pengguna: - Mahasiswa yang ingin mengelola catatan
akademik. - Pengguna umum yang ingin mengelola catatan pribadi dan
daftar pekerjaan.

Masalah yang ditangani: catatan digital dapat memuat informasi
pribadi sehingga perlu dikelola dengan baik dan dikembangkan dengan
mempertimbangkan kerahasiaan, integritas, autentikasi, dan perlindungan
akses.
3. ## 3. Fitur Aplikasi

Fitur SecretNote yang telah dikembangkan meliputi:

**Manajemen Catatan (Note Management)**
- Membuat catatan baru.
- Menampilkan daftar dan detail catatan.
- Mengubah judul, kategori, dan isi catatan.
- Menghapus catatan.
- Mengelola catatan berdasarkan kategori.
- Menyimpan data catatan secara permanen menggunakan PostgreSQL dan Prisma ORM.

**Manajemen Pengguna (User Management)**
- Menampilkan daftar pengguna melalui halaman administrasi.
- Mengubah username, email, dan role pengguna.
- Menghapus pengguna.
- Membatasi pengelolaan pengguna hanya untuk ADMIN.
- Menerapkan perlindungan terhadap penghapusan atau penurunan role administrator terakhir.

**Validasi dan Keamanan**
- Validasi input menggunakan Zod.
- Server Actions untuk pemrosesan data.
- Autentikasi dan pengelolaan sesi pengguna.
- Pembatasan akses berdasarkan role.
- Password hashing menggunakan Argon2id.
- Modul kriptografi AES-256-GCM.
- Modul pengelolaan kunci enkripsi eksternal.

**Batasan penting:** Modul AES-256-GCM dan Key Manager telah diimplementasikan dan diuji secara terpisah. Namun, enkripsi isi catatan belum terintegrasi secara otomatis dengan proses penyimpanan permanen melalui Prisma. Oleh karena itu, belum dapat dinyatakan bahwa seluruh isi catatan yang tersimpan telah terenkripsi secara end-to-end.
## 3.1 Implementasi Tugas 2 — Pengembangan Aplikasi Web (v0.2)

Pada milestone kedua, SecretNote dikembangkan dengan mengintegrasikan penyimpanan data persisten menggunakan PostgreSQL dan Prisma ORM 7.

### A. Data Model

Implementasi database aplikasi menggunakan tiga entitas:

- **User:** menyimpan identitas pengguna, password hash, dan role.
- **Note:** menyimpan catatan yang dimiliki oleh pengguna.
- **Session:** menyimpan informasi sesi autentikasi pengguna.

Relasi antardata:
- User memiliki banyak Note (One-to-Many).
- User memiliki banyak Session (One-to-Many).
- Penghapusan User akan menghapus Note dan Session terkait melalui mekanisme cascade.

### B. Implementasi CRUD

**User Management**
- Create: registrasi dan pembuatan pengguna.
- Read: menampilkan daftar pengguna pada halaman administrasi.
- Update: mengubah username, email, dan role.
- Delete: menghapus pengguna beserta data terkait.

**Note Management**
- Create: membuat catatan baru.
- Read: menampilkan daftar dan detail catatan.
- Update: mengubah judul, kategori, dan isi catatan.
- Delete: menghapus catatan.

### C. Validasi dan Pemrosesan Data

- Validasi input menggunakan Zod pada sisi server.
- Pemrosesan operasi data menggunakan Next.js Server Actions.
- Pesan kesalahan ditampilkan pada field yang relevan.
- Pembatasan akses halaman administrasi berdasarkan role ADMIN.
- Data disimpan secara persisten pada PostgreSQL melalui Prisma ORM.

### D. Pengujian Integrasi Database

Pengujian dilakukan menggunakan data sintetis untuk memverifikasi operasi CRUD dan relasi antardata.

Hasil pengujian terakhir:
- 10 skenario CRUD dan relasi PostgreSQL berhasil.
- 9 skenario validasi Note berhasil.
- Pengujian dilakukan menggunakan Node.js Test Runner dan Prisma Client.

### E. Konfigurasi Database

Konfigurasi database aplikasi menggunakan:
- Prisma Schema: `prisma-app/schema.prisma`
- Prisma Config: `prisma-app.config.ts`
- Migration Directory: `prisma-app/migrations`
- Environment Variable: `APP_DATABASE_URL`

Perintah pengelolaan Prisma:

```bash
npx prisma generate --config prisma-app.config.ts
npx prisma migrate status --config prisma-app.config.ts
npx prisma migrate dev --config prisma-app.config.ts
```
4. Kebutuhan Keamanan dan Kriptografi
SecretNote dirancang untuk mengelola catatan digital yang berpotensi
memuat informasi pribadi. Komponen kriptografi menggunakan AES-256-GCM
untuk melindungi kerahasiaan dan integritas data yang diproses oleh
komponen tersebut.
  Data yang Dilindungi    Tujuan Keamanan         Prioritas
  Isi catatan pribadi     Menjaga kerahasiaan isi Tinggi
catatan melalui
enkripsi dan mendeteksi
perubahan data melalui
autentikasi

  Kunci enkripsi          Menjaga kerahasiaan     Tinggi
kunci agar hanya
komponen yang berwenang
yang dapat
menggunakannya
Metadata catatan,       Mengidentifikasi        Sedang
seperti judul dan       metadata yang
kategori                berpotensi
mengungkapkan informasi
pengguna dan menentukan
kebutuhan
perlindungannya
Prioritas di atas merupakan prioritas rancangan, bukan hasil penilaian
risiko formal.
5. Implementasi Komponen Kriptografi
5.1 Algoritma dan parameter
Komponen menggunakan AES-256-GCM melalui modul bawaan node:crypto.
AES-256-GCM merupakan mekanisme Authenticated Encryption with Associated
Data (AEAD) yang memberikan kerahasiaan serta pemeriksaan integritas dan
autentikasi data.

  Parameter                   Nilai
  Algoritma                   AES-256-GCM
Panjang kunci               256 bit (32 byte)
Nonce / IV                  96 bit (12 byte)
Authentication tag          128 bit (16 byte)
AAD                         SecretNote:v1:aes-256-gcm
Pembuatan kunci dan nonce   crypto.randomBytes()
Representasi data biner     Base64

Nonce dibuat secara acak untuk setiap proses enkripsi. Nonce harus unik
untuk setiap enkripsi menggunakan kunci yang sama. Karena dibuat secara
acak, keunikannya bersifat probabilistik dan bukan jaminan mutlak.
Penggunaan ulang nonce pada AES-GCM harus dihindari.
5.2 Masukan, proses, dan keluaran
  Tahapan                             Deskripsi
  Masukan enkripsi                    Teks catatan dan kunci berukuran 32
byte (256 bit)

  Proses enkripsi                     Membuat nonce acak 12 byte,
mengatur AAD, menjalankan
AES-256-GCM, dan menghasilkan
authentication tag

  Keluaran enkripsi                   Objek EncryptedNote berisi versi
format, nama algoritma, nonce,
ciphertext, tag, dan AAD

  Masukan dekripsi                    Objek data terenkripsi dan kunci
yang sama

  Proses dekripsi                     Memvalidasi struktur, versi,
algoritma, Base64, panjang nonce
dan tag, serta kesesuaian AAD;
kemudian memverifikasi autentikasi
Keluaran dekripsi                   Teks asli jika autentikasi
berhasil; proses gagal jika
validasi atau autentikasi tidak
valid
5.3 Struktur data terenkripsi
Objek EncryptedNote menggunakan field berikut: - version: versi
format data, saat ini 1. - algorithm: algoritma yang digunakan,
yaitu aes-256-gcm. - nonce: nonce 12 byte yang direpresentasikan
dalam Base64. - ciphertext: hasil enkripsi yang direpresentasikan
dalam Base64. - tag: authentication tag 16 byte yang direpresentasikan
dalam Base64. - aad: Additional Authenticated Data yang
direpresentasikan dalam Base64.

Base64 merupakan representasi data biner dalam bentuk teks, bukan
mekanisme enkripsi.
5.4 Additional Authenticated Data (AAD)
AAD menggunakan nilai tetap SecretNote:v1:aes-256-gcm. AAD
diautentikasi bersama ciphertext, tetapi tidak ikut dienkripsi.

Pada implementasi ini, AAD digunakan sebagai konteks tetap format
enkripsi SecretNote. Metadata version dan algorithm divalidasi
secara terpisah melalui pemeriksaan struktur data; keduanya tidak
dimasukkan secara dinamis ke dalam AAD. Jika AAD tidak sesuai dengan
nilai yang ditentukan, proses dekripsi ditolak.
5.5 Pengelolaan kunci
Kunci dibuat melalui fungsi generateKey() menggunakan
randomBytes(32) dari modul node:crypto.

Pengelolaan kunci dilakukan melalui: - saveKey(): menghasilkan dan
menyimpan kunci baru. - loadKey(): membaca serta memvalidasi kunci
yang tersimpan.

Lokasi penyimpanan kunci pada lingkungan pengembangan Windows:

D:\SECRETNOTE-SECRETS\secret-note.key

Kunci disimpan dalam format Base64 di luar repository aplikasi. Proses
penyimpanan menggunakan mode pembuatan file yang menolak penimpaan file
kunci yang sudah tersedia. loadKey() memvalidasi format Base64 dan
memastikan hasil decoding memiliki panjang 32 byte.

Akses direktori dan file kunci pada lingkungan Windows dibatasi
menggunakan Windows Access Control List (ACL). File kunci tidak boleh
diunggah ke repository GitHub atau dibagikan kepada pihak yang tidak
berwenang.
5.6 Validasi dan penanganan kegagalan
Implementasi memvalidasi: 1. Tipe dan panjang kunci. 2. Tipe plaintext.
 Struktur data terenkripsi. 4. Versi dan algoritma. 5. Format Base64
setiap field terkait. 6. Panjang nonce dan authentication tag. 7.
Kesesuaian AAD. 8. Autentikasi ciphertext melalui authentication tag.

Jika validasi atau autentikasi gagal, proses dekripsi ditolak. Plaintext
hanya dikembalikan setelah decipher.final() berhasil. Pendekatan ini
menerapkan prinsip fail closed.
5.7 Batasan komponen kriptografi
Modul kriptografi dan Key Manager telah dibuat serta diuji secara
terpisah. Pengujian integrasi membuktikan bahwa kunci yang disimpan
secara eksternal dapat digunakan untuk enkripsi dan dekripsi.

Namun, mekanisme enkripsi tersebut belum dihubungkan secara langsung
dengan proses penyimpanan permanen isi catatan melalui Prisma. Oleh
karena itu, belum dapat dinyatakan bahwa seluruh isi catatan yang
tersimpan dalam aplikasi telah dienkripsi.
6. ### 6.2 Pengujian Aplikasi dan Autentikasi

| Kelompok | Jumlah Pengujian | Berhasil |
|---|---:|---:|
| Note Validation | 9 | 9 |
| Authentication | 11 | 11 |
| Password / Argon2id | 5 | 5 |
| CRUD dan Relasi PostgreSQL | 10 | 10 |
| **Total** | **35** | **35** |

### 6.3 Pengujian CRUD dan Relasi Database

Pengujian integrasi dilakukan terhadap PostgreSQL menggunakan Prisma ORM dengan data sintetis.

Skenario pengujian meliputi:

1. Create User.
2. Read User.
3. Update User.
4. Delete User.
5. Create Note.
6. Read Note.
7. Update Note.
8. Delete Note.
9. Relasi User–Note.
10. Relasi User–Session.

Hasil pengujian terakhir: 10 skenario berhasil dan tidak terdapat kegagalan.

### 6.4 Rekapitulasi Pengujian

| Kelompok Pengujian | Jumlah | PASS |
|---|---:|---:|
| AES-256-GCM | 10 | 10 |
| Key Management | 4 | 4 |
| Key Integration | 1 | 1 |
| Note Validation | 9 | 9 |
| Authentication | 11 | 11 |
| Password / Argon2id | 5 | 5 |
| CRUD dan Relasi PostgreSQL | 10 | 10 |
| **Total** | **50** | **50** |

Berdasarkan hasil eksekusi pengujian, terdapat 50 pengujian berhasil dan 0 pengujian gagal. Hasil tersebut mencakup pengujian unit, validasi, autentikasi, serta pengujian integrasi CRUD dan relasi database.

Keberhasilan pengujian modul kriptografi tidak berarti bahwa enkripsi telah diterapkan pada seluruh proses penyimpanan catatan secara end-to-end.

### 6.5 Perintah Pengujian

Pengujian dapat dijalankan menggunakan perintah berikut:

```bash
npm run test:crypto
npm run test:notes
npm run test:auth
npm run test:key-manager
npm run test:key-integration
npm run test:password
npm run test:crud
```
7. Teknologi yang Digunakan
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Node.js dan npm
- Prisma
- Modul bawaan Node.js node:crypto
- Modul bawaan Node.js node:test
- PostgreSQL
- Prisma ORM 7
- Zod
- Argon2id
- Prisma PostgreSQL Adapter
- Git dan GitHub untuk pengelolaan versi kode
8. Struktur Proyek
Struktur utama proyek yang relevan dengan pengembangan aplikasi dan
Tugas 2:
secretnote/
app/
├── admin/
│   ├── [id]/
│   │   └── edit/
│   │       ├── page.tsx
│   │       └── edit-user-form.tsx
│   ├── actions.ts
│   ├── delete-user-button.tsx
│   └── page.tsx
├── notes/
│   └── [id]/
│       ├── edit/
│       ├── actions.ts
│       └── delete-note-button.tsx
prisma-app/
├── migrations/
└── schema.prisma
tests/
└── crud-integration.test.ts
├── lib/
│   ├── crypto.ts
│   ├── key-manager.ts
│   └── note-validation.ts
├── tests/
│   ├── auth.test.ts
│   ├── crypto.test.ts
│   ├── key-integration.test.ts
│   ├── key-manager.test.ts
│   ├── note-action.test.ts
│   └── password.test.ts
├── docs/
│   └── evidence/
├── AI_LOG.md
├── KEPUTUSAN.md
├── README.md
└── package.json
Keterangan komponen: - lib/crypto.ts: implementasi enkripsi dan
dekripsi AES-256-GCM dengan AAD. - lib/key-manager.ts: pembuatan,
penyimpanan, dan pembacaan kunci enkripsi. - lib/note-validation.ts:
validasi data formulir catatan. - tests/crypto.test.ts: pengujian
AES-256-GCM dan integritas data. - tests/key-manager.test.ts:
pengujian pengelolaan dan validasi kunci. -
tests/key-integration.test.ts: pengujian penggunaan kunci eksternal
dengan proses enkripsi dan dekripsi. - KEPUTUSAN.md: dokumentasi
keputusan keamanan kriptografi. - AI_LOG.md: catatan penggunaan AI
selama pengembangan.

Struktur di atas merupakan ringkasan direktori dan file yang relevan,
bukan daftar seluruh file repository.
9. Cara Menjalankan Aplikasi
Prasyarat
Pastikan Node.js dan npm sudah terpasang di komputer.
Instalasi dan menjalankan
1. Buka terminal pada folder proyek.
2. Pasang dependensi:
npm install
3. Jalankan server pengembangan:
npm run dev
4. Buka browser dan akses:
http://localhost:3000
Untuk menghentikan server, tekan Ctrl + C pada terminal.
10. Pengujian Aplikasi Web
Pengujian aplikasi web yang telah didokumentasikan mencakup: -
Pemeriksaan navigasi dashboard, daftar catatan, dan halaman catatan
baru. - Pemeriksaan validasi ketika judul atau isi catatan kosong. -
Pemeriksaan tampilan pada ukuran mobile, tablet, dan desktop. -
Pengukuran aksesibilitas menggunakan Lighthouse.
Hasil Pengujian Lighthouse
  Parameter           Hasil
  Kategori audit      Accessibility
Skor                95/100
Target tugas        Minimal 85
Status              Memenuhi target skor
Versi Lighthouse    13.4.1
Browser             Chromium 154.0.0.0
Tanggal pengujian   12 Oktober 2026

Temuan: Lighthouse menampilkan peringatan terkait rasio kontras warna
latar dan teks. Temuan tersebut perlu ditinjau untuk meningkatkan
keterbacaan antarmuka.

Bukti pengujian yang tercatat pada repository: -
docs/evidence/form-validation-empty.png -
docs/evidence/form-validation-success.png -
docs/evidence/lighthouse-accessibility-desktop.png -
docs/evidence/laporan-lighthouse-secretnote.pdf
11. Pengembangan Selanjutnya
Pengembangan berikutnya dapat mencakup: - Integrasi AES-256-GCM ke
proses penyimpanan dan pembacaan catatan melalui Prisma. - Penetapan
strategi pengelolaan dan rotasi kunci untuk penggunaan aplikasi. -
Peninjauan perlindungan metadata catatan. - Penguatan pemodelan ancaman
dan register risiko keamanan. - Peningkatan aksesibilitas dan pengalaman
pengguna.

Fitur tersebut hanya akan dinyatakan tersedia setelah implementasi dan
pengujiannya selesai.
12. Proyek Terpadu Mata Kuliah
SecretNote merupakan proyek individual yang dikembangkan secara bertahap
untuk tiga mata kuliah:
1. Pengembangan Aplikasi Web: antarmuka, navigasi, komponen
   reusable, validasi formulir, responsivitas, autentikasi, dan
   penyimpanan data.
2. Kriptografi: perancangan, implementasi, dan pengujian komponen
   kriptografi AES-256-GCM serta pengelolaan kunci.
3. Keamanan Komputasi dan Siber: inventaris aset, Data Flow Diagram
   (DFD), pemodelan ancaman STRIDE, serta register risiko.
Setiap artefak tugas ditambahkan ke repository sesuai ketentuan dan
tahapan pengumpulan masing-masing mata kuliah.
13. Catatan Penggunaan AI
Penggunaan AI dalam pengembangan dan dokumentasi dicatat pada file
AI_LOG.md. Kode dan dokumentasi ditinjau serta diuji oleh pengembang
sebelum digunakan sebagai hasil pengumpulan.
Catatan status keamanan: dokumentasi ini membedakan modul
kriptografi yang telah diimplementasikan dan diuji dari integrasi
enkripsi ke penyimpanan permanen catatan yang belum tersedia. Jangan
mengartikan keberhasilan pengujian modul sebagai bukti bahwa seluruh
data aplikasi telah dienkripsi.

# Generate Prisma Client
npx prisma generate --config prisma-app.config.ts

# Menjalankan migrasi database
npx prisma migrate dev --config prisma-app.config.ts

# Memeriksa status migrasi
npx prisma migrate status --config prisma-app.config.ts