# Dokumen Teknis Modul 5 — SecretNote

## 1. Schema dan validasi formulir catatan

Formulir `/notes/new` menggunakan field `title`, `category`, dan `content`.
Schema Zod 4 berada di `lib/skema.ts` dan memeriksa:

- `title` wajib berupa teks yang tidak kosong setelah `trim()` digunakan untuk
  memeriksa isinya.
- `category` harus salah satu pilihan yang memang ditampilkan formulir:
  `Personal`, `Akademik`, `Produktivitas`, atau `Lainnya`.
- `content` wajib berupa teks yang tidak kosong setelah `trim()` digunakan
  untuk memeriksa isinya.

Nilai teks tidak diubah oleh pemeriksaan `trim()`. Tidak ada batas panjang,
aturan duplikasi, atau aturan bisnis lain yang ditambahkan karena batas tersebut
belum ditetapkan pada source proyek.

## 2. Alur Server Action

`app/notes/new/actions.ts` menerima `FormData`, mengambil hanya `title`,
`category`, dan `content`, kemudian menjalankan `noteSchema.safeParse` di
server. Jika validasi gagal, action mengembalikan galat per field, pesan umum,
dan nilai field. Jika valid, action menyatakan bahwa input tervalidasi tetapi
belum disimpan.

Route menggunakan React `useActionState`, menampilkan status pending, dan
menghubungkan pesan field ke input menggunakan `aria-invalid` serta
`aria-describedby`. Form mempertahankan `noValidate` agar validasi server dapat
diuji tanpa bergantung pada validasi bawaan browser.

Source proyek belum menyediakan penyimpanan catatan. Oleh sebab itu, action
belum melakukan mutasi, `revalidatePath`, atau `redirect`; status validasi
tidak menyatakan bahwa catatan berhasil dibuat. Action validasi ini dapat
dipanggil langsung tanpa session, tetapi hanya memeriksa input dan tidak
membaca atau mengubah data. Jika penyimpanan ditambahkan kelak, action mutasi
harus memiliki pemeriksaan autentikasi dan otorisasi server tersendiri.

## 3. Bukti pengujian validasi

Pengujian otomatis berada di `tests/note-action.test.ts` dan menggunakan
`node:test`, mengikuti runner bawaan yang sudah digunakan proyek.

| Kasus | Hasil |
|---|---|
| Catatan valid dengan kategori yang tersedia | Lulus |
| Judul hanya berisi spasi | Lulus |
| Isi hanya berisi spasi | Lulus |
| Kategori tidak tersedia | Lulus |
| Judul tidak dikirim | Lulus |
| Kategori tidak dikirim | Lulus |
| Isi tidak dikirim | Lulus |
| File dikirim pada field teks | Lulus |
| Beberapa field salah sekaligus | Lulus |

Kasus-kasus tersebut memanggil Server Action secara langsung dengan `FormData`,
di luar validasi browser. `npm run test:notes` menghasilkan 9 tes lulus dan 0 gagal. Pada verifikasi
terakhir, `npx tsc --noEmit` dan `npm run lint` berhasil. `npm run test:crypto`
menghasilkan 5 tes lulus dan 0 gagal. Node.js menampilkan peringatan
`MODULE_TYPELESS_PACKAGE_JSON` saat menjalankan tes; peringatan tersebut tidak
menyebabkan tes gagal.

Next.js diperbarui dari 16.4.0 ke 16.4.3 setelah audit advisori resmi; patch
pertama yang memperbaiki advisori Oktober adalah 16.4.1. `npm run build` pada
Next.js 16.4.3 berhasil melewati kompilasi, pemeriksaan TypeScript, generation
halaman, dan finalisasi tanpa `SecurityFatalError`. Upgrade ini tidak mengubah
versi React atau React DOM.

Pengujian ini dijalankan saat dibantu AI, bukan pengujian mandiri mahasiswa.
Pengujian browser dan screenshot belum dilakukan dan perlu dilengkapi sendiri
jika diwajibkan dosen.

## 4. Session dan cookie

Login demo menggunakan kredensial server `DEMO_USERNAME` dan `DEMO_PASSWORD`.
Nilai tersebut tidak disimpan di source code atau `.env.example`. Pengembang
harus mengisi nilai fiktif praktikum pada `.env.local`; file environment
diabaikan Git melalui `.gitignore`. Jika variabel belum diatur, login
menampilkan pesan konfigurasi generik dan tidak membuat session.

Session disimpan dalam `Map` di memori proses server. Session menggunakan
referensi acak yang diterbitkan server dan memiliki masa berlaku 3600 detik
(1 jam), sama dengan `Max-Age` cookie. Nilai ini merupakan keputusan
konfigurasi demo, bukan angka yang ditetapkan PDF. Session hanya dianggap
valid jika referensinya ditemukan di Map dan belum kedaluwarsa. Logout
menghapus record session sebelum menghapus cookie, sehingga cookie lama tidak
dapat memulihkan session yang sudah dicabut.

Cookie `secretnote_session` menggunakan `HttpOnly`, `SameSite=Lax`, `Path=/`,
dan `Max-Age=3600`. Atribut `Secure` aktif pada production; deployment
production harus menggunakan HTTPS. Pada development lokal non-HTTPS,
`Secure` tidak diaktifkan agar browser dapat mengirim cookie.

**Batasan session in-memory:** semua session hilang ketika proses server
dimulai ulang dan Map tidak dibagikan antar-instance. Pendekatan ini hanya
untuk demonstrasi satu proses lokal; bukan penyimpanan session untuk deployment
multi-instance/serverless. Pemeriksaan proxy hanya memeriksa keberadaan cookie.
`app/notes/layout.tsx` memvalidasi session di server untuk render route catatan.
Route login tidak masuk matcher sehingga tidak terjadi redirect loop. Proxy
hanya melakukan pemeriksaan awal keberadaan cookie, bukan validasi session.
Setiap Server Component page pada `/notes`, `/notes/new`, dan `/notes/[id]`
memanggil pemeriksaan session server sebelum membentuk konten page. Page
`/notes/new` adalah Server Component yang baru merender komponen form client
setelah pemeriksaan session. Ketiga page memakai `instant = false` karena
validasi session harus menunggu request dan tidak boleh diperlakukan sebagai
konten statis. Helper session memakai `connection()` sebelum pemeriksaan expiry
agar waktu berlaku dihitung saat request. `app/notes/layout.tsx` hanya
meneruskan children dan bukan batas autentikasi.

## 5. Keputusan teknis dan batasan adaptasi

- Implementasi mempertahankan entitas catatan dan field yang dipakai SecretNote:
  `title`, `category`, dan `content`.
- Contoh katalog pada modul memakai model lain dan tidak digunakan untuk
  mengganti model catatan atau menambahkan fitur katalog.
- Zod 4.6.6 dideklarasikan sebagai dependency langsung karena sebelumnya
  tersedia hanya melalui dependency transitif.
- Login demo memakai satu identitas tetap `demo-user`; ini bukan model akun,
  registrasi, atau autentikasi multi-user.
- Session diimplementasikan untuk proses Node lokal melalui modul
  `server-only`. Proxy tidak mengimpor Map atau bergantung pada state bersama;
  proxy hanya melakukan pemeriksaan awal cookie.
- Server Action form catatan tetap hanya memvalidasi input. Ia tidak menyimpan
  atau membaca catatan dan tidak membuktikan perlindungan kepemilikan.
- Data contoh dashboard, daftar, dan katalog tetap bukan data pengguna
  persisten. Tidak ada model kepemilikan catatan atau isolasi pemilik.
- `revalidatePath` dan `redirect` untuk pembuatan catatan belum digunakan
  karena belum ada mutasi data. Redirect setelah login/logout adalah navigasi
  autentikasi, bukan bukti catatan tersimpan.
- Server Actions memakai pemeriksaan Origin/Host bawaan Next.js. Bila
  deployment memakai proxy/CDN pada origin berbeda, konfigurasi allowed
  origins perlu ditinjau sebelum deployment.

## 6. Kendala dan perbaikan

Session in-memory dipilih untuk demo satu proses karena belum ada infrastruktur
session bersama yang dapat diverifikasi. Jika aplikasi dijalankan pada beberapa
instance, setelah restart, atau pada platform serverless, session perlu
dipindahkan ke penyimpanan server bersama sebelum digunakan. Penyimpanan
catatan tetap di luar scope ini.

### Tambahan bukti pengujian autentikasi

`npm run test:auth` menghasilkan 11 tes lulus dan 0 gagal. Pengujian unit
memeriksa verifikasi kredensial, session valid/tidak dikenal/kedaluwarsa/
dicabut, serta keputusan awal route untuk cookie tidak ada, cookie palsu, dan
dashboard publik. Tes proxy ini memeriksa fungsi kebijakan route, bukan
permintaan browser yang melewati Next.js Proxy secara end-to-end.

Pemeriksaan HTTP development juga dilakukan langsung terhadap server lokal:
dashboard dan `/login` memberi status 200; `/notes` dan `/notes/new` tanpa
cookie memberi redirect ke `/login`; cookie palsu pada kedua route tersebut
ditolak tanpa payload konten page. Untuk `/notes/123`, Next.js mengirim
redirect melalui payload streaming (status HTTP 200 dengan penanda
`NEXT_REDIRECT`), bukan status HTTP 307, dan respons tidak memuat isi catatan.
Ini bukan pengujian browser. Selama pemeriksaan tersebut, Next.js development
melaporkan bahwa pembacaan waktu expiry perlu ditunda sampai request; helper
validasi session kini memanggil `connection()` sebelum pemeriksaan itu.

Pemeriksaan keamanan Next.js 16.4.0 sebelumnya menghentikan build production.
Setelah pembaruan ke 16.4.3, `npm run build` berhasil. Sumber resmi advisori
Oktober 2026:
https://nextjs.org/blog/nextjs-security-update-october-14-2026

Lengkapi pengujian manual login valid/gagal, logout, cookie lama pasca-logout,
redirect route terlindungi, akses dashboard publik, dan atribut cookie yang
benar-benar diterima browser. Login tidak dapat diverifikasi end-to-end sampai
`DEMO_USERNAME` dan `DEMO_PASSWORD` dikonfigurasi secara lokal. Samarkan nilai
cookie dalam screenshot. Pengujian yang wajib dikerjakan tanpa AI harus
dilakukan sendiri dan tidak dinyatakan sebagai tes mandiri di sini.

## 7. Penggunaan AI

AI membantu memeriksa source proyek dan dokumentasi Next.js yang terpasang,
menyusun schema dan Server Action validasi, menambahkan pengujian otomatis,
merancang serta mengimplementasikan login demo/session in-memory/proxy, dan
menyusun dokumen ini. Catatan rinci penggunaan dan batas verifikasi terdapat
pada `AI_LOG.md`. Pengujian mandiri yang diwajibkan dosen tetap harus
dilakukan sendiri dan tidak diklaim telah dilakukan oleh dokumen ini.
