# Access Control and Authorization Test — SecretNote

## 1. Tujuan Pengujian

Dokumentasi ini mencatat implementasi dan hasil pengujian autentikasi, otorisasi berbasis role (RBAC), serta pembatasan akses terhadap catatan pribadi pengguna.

Pengujian dilakukan pada aplikasi SecretNote yang menggunakan Next.js dan PostgreSQL.

## 2. Matriks Hak Akses (Role Access Matrix)

| No. | Fitur | USER | ADMIN |
|---|---|---|---|
| 1 | Login | Diizinkan | Diizinkan |
| 2 | Logout | Diizinkan | Diizinkan |
| 3 | Mengakses halaman daftar catatan | Diizinkan | Diizinkan |
| 4 | Membuat catatan | Diizinkan | Diizinkan |
| 5 | Membaca catatan milik sendiri | Diizinkan | Diizinkan |
| 6 | Membaca catatan milik pengguna lain | Ditolak | Ditolak |
| 7 | Mengakses Admin Dashboard | Ditolak | Diizinkan |
| 8 | Registrasi akun baru | Role otomatis USER | Tidak melalui registrasi publik |

**Catatan:** Fitur pengubahan dan penghapusan catatan serta manajemen pengguna dan role belum menjadi bagian dari implementasi yang diuji dalam dokumentasi ini.

## 3. Implementasi Kontrol Akses

### 3.1 Autentikasi

Aplikasi menggunakan session berbasis token yang disimpan pada cookie dengan atribut:

- HttpOnly
- SameSite=Lax
- Secure pada lingkungan production
- Path=/

Token session disimpan dalam bentuk hash SHA-256 pada database.

### 3.2 Role-Based Access Control (RBAC)

Pemeriksaan role dilakukan melalui fungsi `requireRole()` pada:

`lib/auth/user-session.ts`

Halaman administrasi menggunakan:

`app/admin/page.tsx`

Halaman tersebut hanya dapat diakses oleh pengguna dengan role ADMIN.

### 3.3 Pembatasan Kepemilikan Catatan

Pengambilan detail catatan menggunakan kombinasi ID catatan dan ID pemilik:

`app/notes/[id]/page.tsx`

Query menggunakan kondisi:
- `id`: ID catatan yang diminta.
- `userId`: ID pengguna yang sedang login.

Jika catatan tidak ditemukan atau bukan milik pengguna tersebut, aplikasi menampilkan halaman 404.

Kontrol ini diterapkan untuk mencegah Insecure Direct Object Reference (IDOR).

### 3.4 Registrasi Pengguna

Registrasi publik menetapkan role secara eksplisit menjadi `USER`.

Implementasi terdapat pada:

`app/register/actions.ts`

Dengan demikian, pengguna tidak dapat menentukan role ADMIN melalui formulir registrasi.

## 4. Skenario dan Hasil Pengujian

| ID | Skenario Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status |
|---|---|---|---|---|
| AC-01 | Pengguna belum login membuka `/notes` | Redirect ke `/login` | Redirect ke `/login` | PASS |
| AC-02 | Pengguna belum login membuka detail catatan | Redirect ke `/login` | Redirect ke `/login` | PASS |
| AC-03 | USER membuka catatan miliknya | Detail catatan ditampilkan | Detail catatan ditampilkan | PASS |
| AC-04 | ADMIN membuka catatan milik USER | Akses ditolak dengan 404 | Catatan tidak ditemukan | PASS |
| AC-05 | USER membuka catatan milik ADMIN | Akses ditolak dengan 404 | Catatan tidak ditemukan | PASS |
| AC-06 | USER membuka `/admin` | Redirect ke `/notes` | Redirect ke `/notes` | PASS |
| AC-07 | ADMIN membuka `/admin` | Admin Dashboard ditampilkan | Admin Dashboard ditampilkan | PASS |
| AC-08 | Registrasi akun baru | Role ditetapkan USER | Kode menetapkan role USER | PASS |

**Keterangan:** PASS menunjukkan hasil pengujian sesuai dengan hasil yang diharapkan. AC-08 diverifikasi melalui pemeriksaan implementasi kode registrasi.

## 5. Pemetaan terhadap Risk Register

| ID Risiko | Ancaman | Kontrol Mitigasi | Implementasi |
|---|---|---|---|
| R-01 | Information Disclosure | Membatasi akses catatan berdasarkan identitas pemilik | Query catatan menggunakan `id` dan `userId` |
| R-05 | Elevation of Privilege | Pemeriksaan role pada halaman administrasi dan penetapan role USER pada registrasi publik | `requireRole()` dan `registerUser()` |

Pemetaan mengacu pada `docs/risk-register.md`.

## 6. Bukti Pengujian

Bukti yang perlu disimpan dalam dokumentasi tugas:

1. USER berhasil membuka halaman daftar catatan.
2. USER berhasil membuka detail catatan miliknya.
3. ADMIN ditolak ketika mengakses catatan milik USER.
4. USER ditolak ketika mengakses catatan milik ADMIN.
5. USER diarahkan kembali ke halaman `/notes` ketika membuka `/admin`.
6. ADMIN berhasil membuka Admin Dashboard.
7. Pengguna yang belum login diarahkan ke halaman login.

Simpan screenshot pengujian pada folder:

`security/evidence/`

## 7. Kesimpulan

Berdasarkan pengujian yang dilakukan, mekanisme autentikasi, pembatasan akses berdasarkan role, dan pembatasan kepemilikan catatan telah berjalan sesuai hasil yang diharapkan.

Pengujian akses silang menunjukkan bahwa ADMIN maupun USER tidak dapat membaca catatan milik pengguna lain.

Implementasi ini menerapkan prinsip least privilege dengan membatasi akses berdasarkan identitas pengguna dan role yang dimiliki.

Pengujian ini belum mencakup seluruh aspek keamanan aplikasi, termasuk pengubahan dan penghapusan catatan, pengujian penetrasi, serta pengujian keamanan pada lingkungan production.
