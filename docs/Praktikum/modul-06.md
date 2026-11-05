# Dokumen Teknis Modul 6 — SecretNote

## 1. Setup Prisma dan PostgreSQL

Praktikum menggunakan Prisma ORM 7.10.1 dan PostgreSQL 18.6.
Database praktikum bernama `secretnote` dan berjalan pada PostgreSQL lokal.

Konfigurasi Prisma berada pada:

- `prisma/schema.prisma`
- `prisma7.config.ts`
- `.env`

URL koneksi database dibaca dari environment variable `DATABASE_URL`.
Nilai koneksi tidak dituliskan pada dokumen ini agar kredensial database
tidak terekspos.

Prisma 7 menggunakan konfigurasi datasource pada `prisma7.config.ts`.
Prisma Client dihasilkan ke folder `generated/prisma`.

## 2. Schema dan relasi data

Schema praktikum menggunakan dua model, yaitu `Item` dan `Ulasan`.

Model `Item` menyimpan data:

- `id`
- `judul`
- `kategori`
- `deskripsi`
- `tersedia`
- `gambar`
- `dibuatPada`

Model `Ulasan` menyimpan data:

- `id`
- `nama`
- `nilai`
- `komentar`
- `dibuatPada`
- `itemId`

Relasi antara `Item` dan `Ulasan` adalah one-to-many (1:N).
Satu `Item` dapat memiliki beberapa `Ulasan`, sedangkan setiap `Ulasan`
terhubung ke satu `Item` melalui field `itemId`.

Field `judul` pada `Item` bersifat unik. Pada model `Ulasan`, kombinasi
`itemId` dan `nama` memiliki constraint unik.

## 3. Migration database

Migration dibuat menggunakan perintah:

`npx prisma migrate dev --name init`

Migration berhasil dijalankan dan menghasilkan struktur tabel berdasarkan
schema Prisma. File migration tersimpan pada folder `prisma/migrations`.

Prisma Client kemudian dihasilkan menggunakan:

`npx prisma generate`

Perintah tersebut berhasil menghasilkan Prisma Client pada folder
`generated/prisma`.

## 4. Seed data

Seed data dibuat pada file `prisma/seed.ts`.
Seed menggunakan operasi `upsert` agar data contoh dapat dijalankan kembali
tanpa membuat duplikasi berdasarkan unique key yang digunakan.

Data contoh yang dimasukkan:

| Item | Kategori | Ulasan |
|---|---|---|
| Panel Surya Kampus | energi | Mahasiswa A, nilai 5 |
| Bank Sampah | lingkungan | Mahasiswa B, nilai 4 |

Seed dijalankan menggunakan:

`npx prisma db seed`

Perintah berhasil dijalankan. Data diverifikasi melalui Prisma Studio:
tabel `Item` berisi dua data dan tabel `Ulasan` berisi dua data.
Field `itemId` pada setiap ulasan mengacu pada `id` item yang sesuai.

## 5. Verifikasi melalui Prisma Studio

Prisma Studio dijalankan menggunakan:

`npx prisma studio`

Pemeriksaan dilakukan pada tabel `Item` dan `Ulasan`.
Hasil pemeriksaan menunjukkan bahwa data seed berhasil tersimpan dan relasi
antar-model terbentuk sesuai nilai `itemId`.

## 6. CRUD dan Pengujian

Pengujian dilakukan menggunakan script terpisah pada folder `prisma`.
Pengujian ini menggunakan model `Item` dan tidak mengubah modul utama
SecretNote yang masih menggunakan mock data.

### 6.1 CRUD

Script pengujian: `prisma/uji-crud.ts`

Operasi yang diuji:

- CREATE: membuat Item baru.
- READ: mengambil Item berdasarkan ID.
- UPDATE: memperbarui deskripsi Item.
- DELETE: menghapus Item uji.

Hasil: seluruh operasi CRUD berhasil dijalankan.

### 6.2 Relasi Item dan Ulasan

Script pengujian: `prisma/uji-relasi.ts`

Pengujian dilakukan dengan membuat Ulasan yang terhubung ke Item
Bank Sampah melalui `itemId`.

Hasil: Ulasan berhasil tersimpan dan dapat ditemukan melalui relasi
dengan Item yang sesuai.

### 6.3 Error P2003 — Foreign Key Constraint

Script pengujian: `prisma/uji-error.ts`

Pengujian dilakukan dengan mencoba menghapus Item Bank Sampah yang masih
memiliki Ulasan.

Hasil: penghapusan ditolak dengan error P2003 karena terdapat data Ulasan
yang masih terhubung. Perilaku ini sesuai dengan konfigurasi
`onDelete: Restrict`.

### 6.4 Transaction Rollback

Script pengujian: `prisma/uji-transaksi.ts`

Pengujian dilakukan dengan membuat Item di dalam transaksi, kemudian
memunculkan error secara sengaja.

Hasil: transaksi dibatalkan dan Item tidak tersimpan di database.

### 6.5 Error P2002 — Unique Constraint

Script pengujian: `prisma/uji-error-2002.ts`

Pengujian dilakukan dengan mencoba membuat dua Item menggunakan judul
yang sama.

Hasil: pembuatan Item pertama berhasil, sedangkan pembuatan kedua ditolak
dengan error P2002 karena field `judul` memiliki constraint unik.

### 6.6 Error P2025 — Record Tidak Ditemukan

Script pengujian: `prisma/uji-error-p2025.ts`

Pengujian dilakukan dengan mencoba memperbarui Item menggunakan ID
yang tidak ditemukan.

Hasil: operasi ditolak dengan error P2025 dan pesan bahwa Item yang
akan diubah tidak ditemukan.

### 6.7 Rekapitulasi 10 Skenario Pengujian Modul

| No. | Skenario Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status |
|---:|---|---|---|---|
| 1 | Tambah Item dengan data valid | Item tampil di katalog | CREATE berhasil melalui script Prisma; tampilan katalog belum diverifikasi | Sebagian |
| 2 | Tambah Item dengan judul duplikat | Error P2002 pada field judul | Pembuatan Item kedua ditolak dengan P2002 | Lulus |
| 3 | Tambah Item dengan judul kosong | Validasi Zod gagal dan query tidak dijalankan | Belum diuji | Belum diuji |
| 4 | Ubah deskripsi Item | Perubahan tersimpan dan tampil pada detail Item | UPDATE berhasil melalui script Prisma; tampilan detail belum diverifikasi | Sebagian |
| 5 | Ubah Item yang sudah dihapus | Pesan Item tidak ditemukan (P2025) | P2025 telah diuji pada ID Item yang tidak ditemukan; alur setelah penghapusan belum diverifikasi | Perlu konfirmasi |
| 6 | Buka halaman `/katalog/abc` | Halaman 404 | Belum diuji | Belum diuji |
| 7 | Hapus Item yang memiliki Ulasan | Item dan Ulasan terhapus | Belum diuji untuk skenario penghapusan berhasil beserta Ulasan | Belum diuji |
| 8 | Perintah kedua pada proses penghapusan gagal | Transaksi rollback dan Ulasan tetap ada | Rollback telah diuji dengan Item sementara; skenario penghapusan Item dan Ulasan belum diverifikasi | Perlu konfirmasi |
| 9 | Tambah Ulasan dengan nilai 6 | Validasi Zod gagal pada field nilai | Belum diuji | Belum diuji |
| 10 | Tambah Ulasan kedua dengan nama yang sama pada Item yang sama | Error P2002 pada field nama | Belum diuji | Belum diuji |

Catatan: Pengujian melalui script Prisma tidak otomatis membuktikan perilaku halaman aplikasi atau validasi Server Action. Status pengujian disesuaikan dengan bukti aktual yang tersedia.

## 7. Status Pengerjaan

Tahapan yang sudah dilakukan:

- [x] Setup Prisma dan PostgreSQL
- [x] Membuat schema `Item` dan `Ulasan`
- [x] Membuat migration database
- [x] Menghasilkan Prisma Client
- [x] Membuat dan menjalankan seed data
- [x] Memverifikasi data melalui Prisma Studio
- [x] Menguji operasi CRUD
- [x] Menguji relasi Item dan Ulasan
- [x] Menguji error P2003
- [x] Menguji transaction rollback
- [x] Menguji error P2002
- [x] Menguji error P2025

## 8. Penggunaan AI

AI membantu memberikan panduan langkah demi langkah untuk setup Prisma,
penyusunan schema, migration, seed data, implementasi script pengujian,
dan dokumentasi hasil pengujian.

Hasil pengujian yang dicatat pada dokumen ini berasal dari output
terminal yang telah dijalankan. Pengujian mandiri yang diwajibkan dosen
tetap harus dilakukan sendiri dan tidak dinyatakan telah dilakukan
apabila belum selesai.