# Dokumentasi API Note v1

## Ringkasan

API menggunakan Route Handlers Next.js dan Prisma Client aplikasi. Semua
endpoint catatan mewajibkan sesi SecretNote yang masih berlaku. Pengguna hanya
dapat membaca atau mengubah catatannya sendiri; `userId` untuk catatan baru
selalu diambil dari sesi, bukan dari body request. Respons tidak memuat
`passwordHash`, token sesi, atau `userId`.

Spesifikasi OpenAPI 3.1 tersedia di [`openapi.yaml`](./api/openapi.yaml).

## Endpoint

| Method | Path | Keterangan |
|---|---|---|
| GET | `/api/v1/notes` | Daftar catatan pengguna aktif |
| POST | `/api/v1/notes` | Membuat catatan |
| GET | `/api/v1/notes/{id}` | Membaca detail catatan milik pengguna aktif |
| PATCH | `/api/v1/notes/{id}` | Mengubah sebagian field catatan |
| DELETE | `/api/v1/notes/{id}` | Menghapus catatan |
| GET | `/api/v1/users/{userId}/notes` | Membaca relasi catatan pengguna aktif |

`id` dan `userId` harus berupa CUID. Endpoint relasi hanya menampilkan data
ketika `userId` sama dengan pengguna pada sesi aktif; permintaan untuk pengguna
lain menghasilkan 404 agar keberadaan akun tidak terungkap.

### Query koleksi

- `page`: integer 1–10000, default `1`.
- `batas`: integer 1–50, default `20`.
- `category`: opsional, salah satu `Personal`, `Akademik`, `Produktivitas`, atau
  `Lainnya`.

Koleksi dikembalikan dengan urutan `updatedAt` terbaru terlebih dahulu.

### Body create dan patch

`POST` memerlukan `title` dan `content`; kategori boleh tidak dikirim atau
bernilai `null`, sesuai nullable pada model Prisma. `PATCH` menerima satu atau
lebih field tersebut dan menolak object kosong. Field tambahan (termasuk
`userId`) ditolak. Judul dibatasi 100 karakter, isi 20.000 karakter; keduanya
harus berisi teks setelah trim.

```json
{
  "title": "Catatan praktikum",
  "content": "Ringkasan materi.",
  "category": "Akademik"
}
```

### Status respons dan error

- `200`: GET atau PATCH berhasil.
- `201`: POST berhasil; header `Location` menunjuk detail catatan.
- `204`: DELETE berhasil tanpa body.
- `400`: JSON/path/query tidak valid.
- `401`: sesi tidak tersedia atau tidak valid.
- `404`: catatan tidak ditemukan atau bukan milik pengguna aktif.
- `415`: Content-Type bukan `application/json`.
- `422`: body JSON valid tetapi gagal validasi.
- `500`: kegagalan internal; detail implementasi tidak dikirim ke klien.

Error selain respons 204 menggunakan `application/problem+json` dan bentuk
Problem Details RFC 9457. Error validasi menyertakan extension `errors` berisi
path dan pesan tiap field. Respons bersifat privat dan memakai
`Cache-Control: private, no-store`.

## Menjalankan pengujian otomatis

`npm run test:api` menjalankan pengujian kontrak handler dengan repository
memori; pengujian tersebut tidak memerlukan PostgreSQL dan tidak mengubah data
database. `npm run lint` menjalankan ESLint untuk project.

## Skenario uji manual

Jalankan server lokal dengan database dummy lokal yang sudah dikonfigurasi untuk
aplikasi dan buat pengguna uji melalui alur aplikasi. Gunakan sesi lokal untuk
permintaan curl; jangan menaruh cookie/token nyata di dokumentasi, log, atau
repository. Contoh di bawah memakai placeholder:

```powershell
$Base = "http://localhost:3000"
$Cookie = "secretnote_session=<SESI_LOKAL>"
```

| No. | Skenario | Hasil yang diharapkan |
|---:|---|---|
| 1 | GET koleksi tanpa cookie | 401 Problem Details |
| 2 | GET koleksi dengan sesi aktif | 200, `data` dan `pagination` |
| 3 | GET koleksi dengan `?page=0` | 400 Problem Details |
| 4 | POST body valid | 201, data tersimpan dan header `Location` |
| 5 | POST judul kosong atau kategori tidak valid | 422 dengan extension `errors` |
| 6 | POST body JSON rusak | 400 Problem Details |
| 7 | GET detail catatan milik pengguna aktif | 200 dan data tanpa `userId` |
| 8 | GET detail dengan ID bukan CUID | 400 Problem Details |
| 9 | GET detail catatan pengguna lain/tidak ditemukan | 404 tanpa membedakan keduanya |
| 10 | PATCH satu field valid | 200; field lain tetap |
| 11 | PATCH object kosong | 422 Problem Details |
| 12 | DELETE catatan milik pengguna aktif | 204 tanpa body |
| 13 | GET relasi dengan `userId` sendiri | 200 dan daftar catatan |
| 14 | GET relasi memakai `userId` pengguna lain | 404 Problem Details |

Target minimal 90% pada 14 skenario berarti sedikitnya 13 skenario lulus.
Catat status aktual setiap skenario setelah dijalankan; tabel ini adalah rencana
uji dan bukan klaim bahwa uji manual sudah dilaksanakan.
