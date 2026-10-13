# Asset Inventory — SecretNote

## 1. Tujuan

Dokumen ini mengidentifikasi aset yang relevan terhadap keamanan aplikasi SecretNote berdasarkan implementasi dan dokumentasi proyek saat ini.

## 2. Inventaris Aset

| ID | Aset | Deskripsi | Lokasi/Komponen | Kebutuhan Keamanan |
|---|---|---|---|---|
| A-01 | Isi catatan | Teks catatan yang dimasukkan pengguna melalui formulir | `app/notes/new/page.tsx` — state `content` | Kerahasiaan dan integritas |
| A-02 | Judul catatan | Judul catatan yang dimasukkan pengguna | `app/notes/new/page.tsx` — state `title` | Kerahasiaan dan integritas |
| A-03 | Kategori catatan | Kategori yang dipilih pengguna | `app/notes/new/page.tsx` — state `category` | Integritas |
| A-04 | Data contoh catatan | Judul, kategori, deskripsi, dan waktu pembaruan pada daftar catatan | `app/page.tsx` dan `app/notes/page.tsx` — array `notes` | Integritas |
| A-05 | Kunci enkripsi | Kunci 32 byte yang digunakan pada AES-256-GCM | Parameter fungsi pada `lib/crypto.ts` | Kerahasiaan |
| A-06 | Data terenkripsi | Objek `EncryptedNote` yang terdiri dari versi, algoritma, nonce, ciphertext, dan authentication tag | `lib/crypto.ts` — interface `EncryptedNote` | Kerahasiaan dan integritas |
| A-07 | Kode sumber aplikasi | Kode halaman, komponen antarmuka, dan komponen kriptografi | `app/`, `components/`, dan `lib/` | Integritas |
| A-08 | Dokumentasi dan bukti pengujian | README, catatan penggunaan AI, hasil pengujian kriptografi, dan bukti pengujian aplikasi | `README.md`, `AI_LOG.md`, dan `docs/evidence/` | Integritas dan ketersediaan |

## 3. Status Perlindungan Aset

| ID Aset | Kondisi Aktual | Catatan |
|---|---|---|
| A-01 | Data berada dalam React state saat formulir digunakan | Belum terhubung dengan penyimpanan permanen atau fungsi enkripsi |
| A-02 | Data berada dalam React state saat formulir digunakan | Belum terhubung dengan penyimpanan permanen atau fungsi enkripsi |
| A-03 | Data berada dalam React state saat formulir digunakan | Belum terhubung dengan penyimpanan permanen atau fungsi enkripsi |
| A-04 | Berupa data contoh yang ditulis langsung dalam kode | Bukan data catatan yang tersimpan secara permanen |
| A-05 | Dibuat oleh `generateKey()` menggunakan `randomBytes(32)` | Mekanisme penyimpanan dan pengelolaan kunci secara persisten belum diimplementasikan |
| A-06 | Dihasilkan oleh `encryptNote()` dan diproses oleh `decryptNote()` | Komponen kriptografi belum terintegrasi dengan alur penyimpanan catatan aplikasi |
| A-07 | Tersedia sebagai file dalam repository proyek | Integritas kode perlu dijaga melalui pengelolaan versi |
| A-08 | Tersedia sebagai dokumentasi dan file bukti proyek | Perubahan dokumen dan bukti perlu dicatat dalam repository |

## 4. Batasan Inventaris

Inventaris ini menggambarkan kondisi berdasarkan file yang telah diperiksa. Keberadaan database, autentikasi pengguna, penyimpanan permanen catatan, dan mekanisme pengelolaan kunci secara menyeluruh belum dibuktikan oleh kode yang diperiksa.

Aset atau komponen tambahan dapat diperbarui setelah pemeriksaan terhadap keseluruhan implementasi selesai.