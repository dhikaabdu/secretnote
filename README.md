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
3. Fitur Aplikasi
Fitur yang telah dikembangkan meliputi: - Dashboard dan halaman daftar
catatan. - Halaman pembuatan catatan baru. - Pengelompokan catatan
berdasarkan kategori. - Komponen antarmuka yang dapat digunakan
kembali. - Validasi input pada formulir pembuatan catatan. - Server
Action untuk memproses permintaan pembuatan catatan. - Autentikasi dan
pengelolaan sesi pengguna. - Pembatasan akses pada halaman yang
dilindungi. - Penyimpanan catatan menggunakan Prisma. - Modul
kriptografi AES-256-GCM. - Modul pengelolaan kunci enkripsi eksternal.

Batasan penting: walaupun penyimpanan catatan melalui Prisma dan
modul kriptografi telah tersedia, isi catatan yang disimpan melalui
Prisma belum dienkripsi secara otomatis. Modul AES-256-GCM dan Key
Manager telah diuji melalui pengujian terpisah, termasuk pengujian
integrasi kunci eksternal dengan fungsi enkripsi dan dekripsi.
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
3. Struktur data terenkripsi. 4. Versi dan algoritma. 5. Format Base64
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
6. Pengujian Otomatis
Pengujian otomatis menggunakan Node.js Test Runner (node:test) dan
node:assert/strict.
6.1 Pengujian kriptografi dan pengelolaan kunci
  Kelompok        Skenario                          Jumlah             Berhasil
  AES-256-GCM dan Enkripsi/dekripsi                     10                   10
AAD             normal, catatan
kosong, nonce
berbeda, kunci
salah, ciphertext
berubah, validasi
AAD, AAD berubah,
tag berubah, nonce
berubah, Base64
tidak valid

  Key Management  Pembuatan dan                          4                    4
penyimpanan kunci,
pembacaan kunci,
pencegahan
penimpaan,
penolakan file
kunci tidak valid

  Key Integration Penggunaan kunci                       1                    1
eksternal untuk
enkripsi dan
dekripsi
Total                                         15               15
6.2 Pengujian aplikasi dan autentikasi
  Kelompok                Jumlah pengujian   Hasil terakhir yang dilaporkan
  Note Validation                        9                          9 lulus
Authentication                        11                         11 lulus
Password / Argon2id                    5                          5 lulus

Berdasarkan hasil eksekusi yang telah dilaporkan selama pengembangan,
total terdapat 40 pengujian lulus dari 40 pengujian. Rincian
tersebut menggabungkan pengujian kriptografi, pengelolaan kunci,
integrasi, validasi catatan, autentikasi, dan password. Hasil ini
merupakan hasil pengujian modul masing-masing, bukan bukti bahwa seluruh
alur penyimpanan catatan telah terenkripsi secara end-to-end.
6.3 Perintah pengujian
Perintah yang tersedia pada package.json:
npm run test:crypto
npm run test:key-manager
npm run test:key-integration
npm run test:notes
npm run test:auth
Pengujian password dapat dijalankan secara langsung dengan:
node --conditions=react-server --experimental-strip-types --test --test-reporter=spec tests/password.test.ts
Catatan: warning MODULE_TYPELESS_PACKAGE_JSON dapat muncul ketika
Node.js memproses file TypeScript sebagai ES Module tanpa deklarasi tipe
modul eksplisit pada package.json. Warning tersebut tidak sama dengan
kegagalan test.
7. Teknologi yang Digunakan
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Node.js dan npm
- Prisma
- Modul bawaan Node.js node:crypto
- Modul bawaan Node.js node:test
- Git dan GitHub untuk pengelolaan versi kode
8. Struktur Proyek
Struktur utama proyek yang relevan dengan pengembangan aplikasi dan
Tugas 2:
secretnote/
├── app/
│   ├── login/
│   ├── notes/
│   │   └── new/
│   │       ├── actions.ts
│   │       ├── note-form.tsx
│   │       └── page.tsx
│   ├── praktikum-modul-06/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
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
