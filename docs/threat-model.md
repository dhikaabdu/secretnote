# Threat Model STRIDE — SecretNote

## 1. Tujuan

Dokumen ini mengidentifikasi ancaman keamanan pada SecretNote berdasarkan elemen dalam `dfd.md` dan implementasi yang telah diperiksa.

Ancaman merupakan skenario yang perlu dievaluasi, bukan pernyataan bahwa kerentanan tersebut telah terbukti terjadi.

## 2. Daftar Ancaman STRIDE

| ID | Kategori STRIDE | Elemen DFD | Aset Terdampak | Skenario Ancaman | Dasar Kondisi Produk |
|---|---|---|---|---|---|
| T-01 | Spoofing | E-01, P-01 | A-01, A-02, A-03 | Pihak lain menggunakan sesi browser yang terbuka untuk melihat atau memasukkan data pada formulir | Aplikasi belum menunjukkan mekanisme autentikasi pengguna pada kode yang diperiksa |
| T-02 | Spoofing | P-03 | A-05 | Pemanggil yang tidak semestinya memberikan kunci yang bukan milik pengguna yang berwenang kepada fungsi kriptografi | Fungsi menerima kunci melalui parameter dan tidak mengelola identitas pemilik kunci |
| T-03 | Tampering | P-02, D-01 | A-01, A-02, A-03 | Nilai formulir diubah sebelum validasi atau ketika state digunakan oleh antarmuka | Validasi saat ini hanya memeriksa apakah judul dan isi tidak kosong |
| T-04 | Tampering | P-03 | A-06 | Ciphertext atau authentication tag diubah sebelum dekripsi | Komponen menerima objek terenkripsi dari pemanggil; integritas diverifikasi ketika autentikasi AES-GCM berhasil atau gagal |
| T-05 | Repudiation | P-01 | A-04, A-07 | Perubahan pada data contoh atau kode tidak dapat ditelusuri ke aktivitas pengguna melalui log aktivitas aplikasi | Kode yang diperiksa belum menunjukkan pencatatan aktivitas pengguna |
| T-06 | Repudiation | P-03 | A-05, A-06 | Tidak tersedia catatan aktivitas yang menunjukkan kapan fungsi enkripsi atau dekripsi dipanggil | Komponen kriptografi hanya menyediakan fungsi pemrosesan dan tidak menunjukkan mekanisme audit |
| T-07 | Information Disclosure | P-01, D-01 | A-01, A-02, A-03 | Isi, judul, atau kategori catatan dapat terlihat oleh orang lain yang memperoleh akses ke tampilan browser | Data formulir berada dalam React state dan belum dienkripsi oleh alur formulir |
| T-08 | Information Disclosure | P-03 | A-05 | Kunci enkripsi terekspos melalui pemanggil atau mekanisme penyimpanan yang tidak aman | Fungsi menerima kunci melalui parameter; penyimpanan dan pengelolaan kunci persisten belum diimplementasikan |
| T-09 | Information Disclosure | D-02, P-01 | A-04 | Data contoh yang tertanam pada kode dapat terlihat oleh pihak yang memperoleh akses ke kode sumber atau tampilan aplikasi | Array `notes` ditulis langsung pada file halaman |
| T-10 | Denial of Service | P-01, P-02 | A-01, A-02, A-03 | Input yang sangat besar dapat meningkatkan penggunaan memori atau mengganggu responsivitas halaman ketika diproses | Formulir yang diperiksa belum menunjukkan pembatasan panjang input |
| T-11 | Denial of Service | P-03 | A-06 | Pemrosesan teks berukuran sangat besar dapat meningkatkan penggunaan memori saat enkripsi atau dekripsi | Fungsi memproses teks melalui buffer dan belum menunjukkan pembatasan ukuran input |
| T-12 | Elevation of Privilege | P-01, P-03 | A-05, A-06 | Jika komponen kriptografi kelak dipanggil oleh fitur dengan hak akses yang tidak tepat, fungsi dapat digunakan tanpa pemeriksaan otorisasi yang memadai | Komponen kriptografi belum terintegrasi dengan autentikasi dan otorisasi pengguna |

## 3. Catatan Penilaian Ancaman

1. T-01 dan T-02 merupakan skenario penyalahgunaan identitas atau konteks pemanggilan; bukan bukti bahwa penyerang telah memperoleh akses.
2. T-03 dan T-04 membedakan perubahan input aplikasi dari perubahan data terenkripsi. AES-256-GCM dirancang untuk mendeteksi perubahan ciphertext atau tag ketika verifikasi autentikasi dilakukan.
3. T-05 dan T-06 mengidentifikasi keterbatasan audit. Tidak adanya log pada kode yang diperiksa tidak membuktikan bahwa tidak ada log pada seluruh lingkungan.
4. T-07 hingga T-09 membahas kemungkinan paparan data formulir, kunci, dan data contoh pada kondisi yang berbeda.
5. T-10 dan T-11 adalah skenario dampak penggunaan sumber daya, bukan hasil pengujian beban.
6. T-12 merupakan skenario untuk integrasi mendatang; mekanisme otorisasi belum dapat dinilai secara menyeluruh karena integrasi tersebut belum tersedia.

## 4. Batasan

Ancaman di atas disusun dari elemen DFD dan kode yang telah diperiksa. Penilaian kemungkinan, dampak, serta prioritas risiko dilakukan secara terpisah dalam `risk-register.md`. Skenario yang belum diuji tidak dinyatakan sebagai kerentanan yang telah terbukti.