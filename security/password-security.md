# Password Security — SecretNote

## 1. Tujuan

Memastikan password pengguna tidak disimpan dalam bentuk plaintext dan menggunakan algoritma password hashing yang dirancang untuk memperlambat percobaan tebakan password.

## 2. Algoritma yang Digunakan

SecretNote menggunakan Argon2id melalui package `argon2`.

Konfigurasi:
- Algorithm: Argon2id
- Memory Cost: 19456 KiB
- Time Cost: 2
- Parallelism: 1

Implementasi terdapat pada:

`lib/auth/password.ts`

Fungsi yang digunakan:
- `hashPassword()`: menghasilkan hash password.
- `verifyPassword()`: memverifikasi password terhadap hash yang tersimpan.

## 3. Mekanisme Perlindungan

1. Pengguna memasukkan password ketika registrasi.
2. Aplikasi memproses password menggunakan Argon2id.
3. Database menyimpan hasil hash pada kolom `passwordHash`.
4. Password asli tidak disimpan sebagai plaintext.
5. Ketika login, password yang dimasukkan diverifikasi menggunakan `verifyPassword()`.
6. Password yang salah akan ditolak.

Argon2id menggunakan salt acak sehingga password yang sama dapat menghasilkan hash yang berbeda.

## 4. Hasil Pengujian Otomatis

Pengujian dilakukan menggunakan:

`tests/password.test.ts`

Perintah pengujian:

`node --conditions=react-server --experimental-strip-types --test --test-reporter=spec tests/password.test.ts`

| ID | Skenario Pengujian | Hasil yang Diharapkan | Status |
|---|---|---|---|
| PW-01 | Menghasilkan hash password | Hash bukan plaintext | PASS |
| PW-02 | Memverifikasi password benar | Verifikasi berhasil | PASS |
| PW-03 | Memverifikasi password salah | Verifikasi ditolak | PASS |
| PW-04 | Menghasilkan hash dari password yang sama | Hash berbeda karena salt acak | PASS |
| PW-05 | Memverifikasi hash tidak valid | Verifikasi ditolak | PASS |

### Ringkasan Pengujian

- Total pengujian: 5
- Berhasil: 5
- Gagal: 0

## 5. Verifikasi Penyimpanan Database

Pemeriksaan database menunjukkan bahwa akun pengguna menyimpan password dalam bentuk hash Argon2id.

Hash memiliki prefix `$argon2id$`.

Pemeriksaan dilakukan tanpa menampilkan password asli maupun keseluruhan hash pengguna.

## 6. Pemetaan terhadap Risiko

| ID Risiko | Ancaman | Kontrol Mitigasi | Implementasi |
|---|---|---|---|
| R-01 | Information Disclosure | Mengurangi risiko paparan password melalui penyimpanan hash, bukan plaintext | Argon2id password hashing |

## 7. Kesimpulan

Berdasarkan lima pengujian otomatis, fungsi hashing dan verifikasi password Argon2id berjalan sesuai skenario yang ditetapkan.

Password tidak disimpan sebagai plaintext, verifikasi password benar berhasil, password salah ditolak, dan salt acak menghasilkan hash berbeda.

Pengujian ini membuktikan fungsi password hashing dan verification, bukan keseluruhan ketahanan autentikasi terhadap serangan seperti brute force atau credential stuffing.
