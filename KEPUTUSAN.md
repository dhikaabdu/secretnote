
# KEPUTUSAN KEAMANAN KRIPTOGRAFI SECRETNOTE

## 1. Tujuan

Dokumen ini menjelaskan keputusan keamanan kriptografi pada aplikasi SecretNote untuk melindungi kerahasiaan dan integritas data catatan pengguna.

Implementasi menggunakan mekanisme Authenticated Encryption with Associated Data (AEAD) untuk memastikan data yang dienkripsi hanya dapat dibaca menggunakan kunci yang benar serta dapat dideteksi apabila mengalami perubahan.

## 2. Persyaratan Keamanan

Persyaratan keamanan yang diterapkan meliputi:

1. Kerahasiaan: isi catatan tidak dapat dibaca tanpa kunci enkripsi yang benar.
2. Integritas: perubahan terhadap ciphertext harus dapat dideteksi.
3. Autentikasi: proses dekripsi harus memverifikasi authentication tag.
4. Keamanan kunci: kunci dibuat menggunakan Cryptographically Secure Pseudo-Random Number Generator (CSPRNG).
5. Pemisahan kunci: kunci disimpan di luar repository aplikasi.
6. Validasi input: data terenkripsi harus melalui pemeriksaan format dan parameter.
7. Fail closed: proses dekripsi ditolak apabila autentikasi atau validasi gagal.

## 3. Mekanisme Kriptografi yang Dipilih

Mekanisme yang digunakan adalah AES-256-GCM (Advanced Encryption Standard - 256-bit Galois/Counter Mode).

AES-256-GCM merupakan mekanisme AEAD yang memberikan dua perlindungan utama:

- Confidentiality: melindungi kerahasiaan plaintext.
- Integrity and authenticity: mendeteksi perubahan data melalui authentication tag.

Mekanisme ini dipilih karena dapat memberikan perlindungan kerahasiaan dan integritas dalam satu proses enkripsi.

Implementasi menggunakan modul `node:crypto` bawaan Node.js.

## 4. Parameter Kriptografi

| Parameter | Nilai |
|---|---|
| Algoritma | AES-256-GCM |
| Panjang kunci | 256 bit (32 byte) |
| Nonce / IV | 96 bit (12 byte) |
| Authentication tag | 128 bit (16 byte) |
| AAD | SecretNote:v1:aes-256-gcm |
| Key generation | crypto.randomBytes() |
| Encoding penyimpanan | Base64 |

Nonce dihasilkan secara acak menggunakan `randomBytes(12)` pada setiap proses enkripsi.

Nonce harus unik untuk setiap proses enkripsi menggunakan kunci yang sama. Karena nonce dibuat secara acak, keunikannya bersifat probabilistik dan bukan jaminan mutlak. Penggunaan ulang nonce pada AES-GCM harus dihindari karena dapat membahayakan kerahasiaan dan integritas data.

## 5. Additional Authenticated Data (AAD)

Implementasi menggunakan AAD dengan nilai tetap:

`SecretNote:v1:aes-256-gcm`

AAD merupakan data tambahan yang diautentikasi bersama ciphertext, tetapi tidak ikut dienkripsi.

Nilai AAD digunakan sebagai konteks tetap untuk format enkripsi SecretNote dan diatur melalui fungsi `setAAD()` pada proses enkripsi dan dekripsi.

Pada implementasi ini, metadata `version` dan `algorithm` divalidasi secara terpisah melalui pemeriksaan struktur data. Keduanya tidak dimasukkan secara dinamis ke dalam AAD.

Apabila nilai AAD tidak sesuai dengan nilai yang ditentukan, proses dekripsi akan ditolak.

## 6. Pengelolaan Kunci

Kunci enkripsi dibuat menggunakan fungsi `generateKey()` yang memanfaatkan `randomBytes(32)` dari modul `node:crypto`.

Kunci disimpan secara terpisah dari repository aplikasi pada lokasi:

`D:\SECRETNOTE-SECRETS\secret-note.key`

Pengelolaan kunci dilakukan melalui:

- `saveKey()`: menghasilkan dan menyimpan kunci baru.
- `loadKey()`: membaca serta memvalidasi kunci yang tersimpan.

Kunci disimpan dalam format Base64 dan divalidasi agar memiliki panjang 32 byte setelah proses decoding.

Penyimpanan menggunakan mekanisme pembuatan file tanpa menimpa file kunci yang sudah tersedia.

File kunci tidak boleh diunggah ke repository GitHub dan harus dilindungi dari akses pihak yang tidak berwenang.

Pada lingkungan Windows, akses terhadap direktori dan file kunci dibatasi menggunakan Windows Access Control List (ACL).

## 7. Validasi dan Penanganan Kegagalan

Implementasi menerapkan validasi terhadap:

1. Tipe dan panjang kunci.
2. Versi dan algoritma enkripsi.
3. Format Base64.
4. Panjang nonce dan authentication tag.
5. Kesesuaian AAD.
6. Integritas ciphertext dan authentication tag.

Apabila terjadi perubahan ciphertext, nonce, AAD, authentication tag, atau penggunaan kunci yang salah, proses dekripsi akan gagal.

Plaintext hanya dikembalikan setelah proses autentikasi berhasil melalui `decipher.final()`.

Pendekatan ini menerapkan prinsip fail closed, yaitu menolak pemrosesan data apabila validasi atau autentikasi tidak berhasil.

## 8. Pengujian Keamanan

Pengujian otomatis dilakukan menggunakan Node.js Test Runner.

Skenario pengujian mencakup:

- Enkripsi dan dekripsi normal.
- Pemrosesan catatan kosong.
- Perbedaan nonce pada setiap enkripsi.
- Penolakan penggunaan kunci yang salah.
- Penolakan ciphertext yang dimodifikasi.
- Validasi nilai AAD.
- Penolakan AAD yang dimodifikasi.
- Penolakan authentication tag yang dimodifikasi.
- Penolakan nonce yang dimodifikasi.
- Penolakan representasi Base64 tidak valid.
- Pembuatan dan penyimpanan kunci.
- Pembacaan kembali kunci.
- Pencegahan penimpaan kunci lama.
- Penolakan file kunci tidak valid.
- Integrasi kunci eksternal dengan proses enkripsi dan dekripsi.

Hasil pengujian:

| Kelompok | Jumlah Pengujian | Berhasil |
|---|---:|---:|
| AES-256-GCM dan AAD | 10 | 10 |
| Key Management | 4 | 4 |
| Key Integration | 1 | 1 |
| **Total** | **15** | **15** |

## 9. Batasan Implementasi

Implementasi kriptografi AES-256-GCM dan pengelolaan kunci telah dibuat serta diuji secara terpisah melalui modul dan pengujian otomatis.

Namun, mekanisme enkripsi tersebut belum diintegrasikan secara langsung ke proses penyimpanan permanen isi catatan melalui Prisma.

Dengan demikian, pengujian yang dilakukan membuktikan fungsi enkripsi, dekripsi, validasi, dan pengelolaan kunci pada modul kriptografi, bukan membuktikan enkripsi end-to-end pada seluruh alur penyimpanan catatan aplikasi.

## 10. Kesimpulan

Berdasarkan implementasi dan pengujian yang telah dilakukan, SecretNote menggunakan AES-256-GCM sebagai mekanisme AEAD untuk melindungi kerahasiaan dan integritas data melalui modul kriptografi.

Penggunaan AAD, authentication tag, validasi input, serta pengelolaan kunci di luar repository menjadi bagian dari penerapan keamanan kriptografi pada aplikasi.

Seluruh 15 skenario pengujian otomatis berhasil dijalankan dengan hasil 15 lulus dan 0 gagal.

Implementasi ini memenuhi kebutuhan pengujian kriptografi pada modul yang dikembangkan, dengan catatan bahwa integrasi enkripsi ke penyimpanan permanen catatan masih menjadi batasan implementasi.
