# Risk Register — SecretNote

## 1. Metode Penilaian

Penilaian menggunakan skala 1–5 untuk kemungkinan dan dampak.

### Kemungkinan

| Nilai | Kriteria |
|---|---|
| 1 | Sangat rendah: membutuhkan kondisi khusus yang sulit terjadi |
| 2 | Rendah: membutuhkan beberapa kondisi pendukung |
| 3 | Sedang: masuk akal terjadi pada kondisi tertentu |
| 4 | Tinggi: kondisi pendukung relatif mudah ditemukan |
| 5 | Sangat tinggi: sangat mudah terjadi atau berulang |

### Dampak

| Nilai | Kriteria |
|---|---|
| 1 | Sangat rendah: pengaruh minimal |
| 2 | Rendah: pengaruh terbatas |
| 3 | Sedang: mengganggu sebagian fungsi atau data |
| 4 | Tinggi: dapat mengakibatkan paparan atau gangguan yang berarti |
| 5 | Sangat tinggi: dapat mengakibatkan paparan data sensitif atau kegagalan keamanan yang serius |

Skor risiko dihitung dengan rumus:

**Skor Risiko = Kemungkinan × Dampak**

Kategori skor:
- 1–4: Rendah
- 5–9: Sedang
- 10–16: Tinggi
- 17–25: Sangat tinggi

Nilai merupakan estimasi awal dan perlu ditinjau kembali jika implementasi atau konteks penggunaan berubah.

## 2. Daftar Risiko Prioritas

| ID | Ancaman Terkait | Elemen DFD | Aset Terdampak | Kemungkinan | Dampak | Skor | Prioritas |
|---|---|---|---|---:|---:|---:|---|
| R-01 | T-07: Information Disclosure | P-01, D-01 | A-01, A-02, A-03 | 3 | 4 | 12 | Tinggi |
| R-02 | T-08: Information Disclosure | P-03 | A-05 | 3 | 5 | 15 | Tinggi |
| R-03 | T-04: Tampering | P-03 | A-06 | 2 | 4 | 8 | Sedang |
| R-04 | T-10: Denial of Service | P-01, P-02 | A-01, A-02, A-03 | 3 | 3 | 9 | Sedang |
| R-05 | T-12: Elevation of Privilege | P-01, P-03 | A-05, A-06 | 2 | 5 | 10 | Tinggi |

## 3. Alasan Kemungkinan dan Dampak

### R-01 — Paparan Data Formulir

- **Kemungkinan: 3.** Formulir menyimpan judul, kategori, dan isi dalam React state. Data tersebut belum dienkripsi oleh alur formulir. Paparan kepada pihak lain tetap membutuhkan kondisi pendukung, misalnya akses ke browser yang sedang digunakan.
- **Dampak: 4.** Catatan dapat berisi informasi pribadi. Apabila isi atau judul sensitif terlihat oleh pihak lain, kerahasiaan informasi dapat terganggu.
- **Dasar:** `app/notes/new/page.tsx` dan `README.md`.

### R-02 — Pengelolaan Kunci Enkripsi Belum Terintegrasi

- **Kemungkinan: 3.** Fungsi kriptografi menerima kunci melalui parameter, sementara pengelolaan kunci secara persisten belum diimplementasikan. Paparan kunci belum terbukti terjadi, tetapi desain integrasinya masih perlu ditentukan.
- **Dampak: 5.** Jika kunci yang digunakan untuk mengenkripsi data sensitif terekspos, pihak yang memperolehnya berpotensi mendekripsi ciphertext terkait.
- **Dasar:** `lib/crypto.ts` dan batasan implementasi pada `README.md`.

### R-03 — Perubahan Data Terenkripsi

- **Kemungkinan: 2.** Objek terenkripsi dapat diberikan kepada fungsi dekripsi, sehingga perubahan data merupakan skenario yang perlu diuji. Belum ada bukti bahwa ciphertext aplikasi telah dimanipulasi.
- **Dampak: 4.** Perubahan yang tidak lolos autentikasi dapat menyebabkan proses dekripsi gagal dan data tidak dapat digunakan melalui operasi tersebut.
- **Dasar:** `decryptNote()` menggunakan authentication tag AES-GCM. Pengujian perubahan ciphertext juga tercatat dalam dokumentasi pengujian kriptografi.

### R-04 — Penggunaan Sumber Daya Berlebihan

- **Kemungkinan: 3.** Formulir belum menunjukkan pembatasan panjang input pada kode yang diperiksa. Namun, belum ada pengujian beban yang membuktikan terjadinya gangguan.
- **Dampak: 3.** Input yang sangat besar berpotensi meningkatkan penggunaan memori atau mengurangi responsivitas halaman.
- **Dasar:** `app/notes/new/page.tsx`.

### R-05 — Otorisasi Komponen Kriptografi

- **Kemungkinan: 2.** Komponen kriptografi belum terintegrasi dengan mekanisme autentikasi dan otorisasi pengguna. Penyalahgunaan dalam konteks integrasi mendatang masih merupakan skenario yang perlu dicegah.
- **Dampak: 5.** Jika kelak fungsi digunakan tanpa pembatasan yang sesuai untuk data sensitif, data dapat diproses oleh pihak atau konteks yang tidak semestinya.
- **Dasar:** `lib/crypto.ts` dan batasan integrasi pada `README.md`.

## 4. Rencana Kontrol Mitigasi

| ID Risiko | Rencana Kontrol | Pengaruh yang Diharapkan | Pemetaan Tugas |
|---|---|---|---|
| R-01 | Integrasikan enkripsi dengan alur pembuatan dan pembacaan catatan sebelum penyimpanan permanen diterapkan; uji bahwa teks biasa tidak disimpan sebagai isi catatan persisten | Mengurangi kemungkinan paparan isi catatan | Tugas 2 |
| R-02 | Rancang pengelolaan kunci yang terpisah dari ciphertext; batasi akses kunci, hindari menyimpan kunci di repository, dan uji skenario kunci salah atau tidak tersedia | Mengurangi kemungkinan paparan kunci dan membatasi dampaknya | Tugas 2 |
| R-03 | Pertahankan verifikasi authentication tag AES-GCM dan tambahkan pengujian untuk perubahan ciphertext, tag, nonce, serta format input | Mengurangi kemungkinan data yang dimodifikasi diterima sebagai data autentik | Tugas 1 |
| R-04 | Tetapkan batas panjang judul dan isi, validasi input, serta uji perilaku aplikasi menggunakan input berukuran besar | Mengurangi kemungkinan penggunaan sumber daya berlebihan | Tugas 2 |
| R-05 | Sebelum integrasi fitur sensitif, tetapkan pemeriksaan autentikasi dan otorisasi pada lapisan aplikasi yang sesuai; uji akses yang diizinkan dan ditolak | Mengurangi kemungkinan penyalahgunaan fungsi oleh konteks yang tidak berwenang | Tugas 2 |

**Catatan pemetaan:** Tugas 1 merujuk pada pekerjaan komponen kriptografi yang telah dilakukan. Tugas 2 merujuk pada pekerjaan pengembangan aplikasi web dan integrasinya. Pemetaan ini merupakan usulan berdasarkan konteks proyek dan harus disesuaikan jika penamaan tugas resmi dosen berbeda.

## 5. Batasan Penilaian

Penilaian risiko ini bersifat awal. Nilai kemungkinan dan dampak didasarkan pada kondisi implementasi yang diperiksa, bukan hasil pengujian penetrasi, pengujian beban, atau insiden keamanan yang telah terjadi.

Kontrol mitigasi di atas merupakan rencana pekerjaan, bukan klaim bahwa kontrol tersebut telah diterapkan atau diuji.