# Hasil Uji Manual API Item v1

Tanggal pelaksanaan: 2026-11-27. Pengujian dijalankan terhadap server lokal
`http://localhost:3000` dan database dummy lokal `DATABASE_URL`; tidak ada
nilai URL atau kredensial yang dicatat.

ID seed yang dibaca langsung sebelum tes:

- Item `Panel Surya Kampus`: ID `1`, satu ulasan.
- Item `Bank Sampah`: ID `2`, dua ulasan.
- Item sementara untuk PATCH/DELETE sukses: ID `10`, tanpa ulasan. Item ini
  berhasil dihapus oleh endpoint DELETE setelah tes.

Semua request pada tabel cURL benar-benar dikirim dengan `curl.exe`; kolom
actual berisi status HTTP yang diterima. PASS berarti status sama dengan
expected dan assertion response-body yang disebutkan pada kasus terkait juga
lulus.

| No. | Kasus / cURL | Body | Expected | Actual | Hasil |
|---:|---|---|---:|---:|---|
| 1 | `GET http://localhost:3000/api/v1/item/1` | — | 200 | 200 | PASS |
| 2 | `GET http://localhost:3000/api/v1/item/1/ulasan` | — | 200 | 200 | PASS |
| 3 | `GET http://localhost:3000/api/v1/item/2/ulasan` | — | 200 | 200 | PASS |
| 4 | `GET http://localhost:3000/api/v1/item/0` | — | 400 | 400 | PASS |
| 5 | `GET http://localhost:3000/api/v1/item/2147483648` | — | 400 | 400 | PASS |
| 6 | `GET http://localhost:3000/api/v1/item/2147483647` | — | 404 | 404 | PASS |
| 7 | `PATCH http://localhost:3000/api/v1/item/10` | `{"tersedia":false}` | 200 | 200 | PASS |
| 8 | `PATCH http://localhost:3000/api/v1/item/10` | `{"kategori":"unknown"}` | 422 | 422 | PASS |
| 9 | `PATCH http://localhost:3000/api/v1/item/10` | `{}` | 422 | 422 | PASS |
| 10 | `PATCH http://localhost:3000/api/v1/item/10` | `{` | 400 | 400 | PASS |
| 11 | `PATCH http://localhost:3000/api/v1/item/10` tanpa `Content-Type: application/json` | `{"tersedia":true}` | 415 | 415 | PASS |
| 12 | `PATCH http://localhost:3000/api/v1/item/2147483647` | `{"tersedia":false}` | 404 | 404 | PASS |
| 13 | `DELETE http://localhost:3000/api/v1/item/1` (Item seed masih memiliki ulasan) | — | 409 | 409 | PASS |
| 14 | `DELETE http://localhost:3000/api/v1/item/2147483647` | — | 404 | 404 | PASS |
| 15 | `DELETE http://localhost:3000/api/v1/item/10` (Item sementara tanpa relasi) | — | 204, body kosong | 204, body kosong | PASS |
| 16 | `GET http://localhost:3000/api/v1/item/10/ulasan` setelah penghapusan | — | 404 | 404 | PASS |

Perintah untuk mengulang request dapat dijalankan di PowerShell. Pastikan
server lokal sudah aktif:

```powershell
$base = "http://localhost:3000/api/v1/item"
curl.exe -i "$base/1"
curl.exe -i "$base/1/ulasan"
curl.exe -i "$base/2/ulasan"
curl.exe -i "$base/0"
curl.exe -i "$base/2147483648"
curl.exe -i "$base/2147483647"
curl.exe -i -X PATCH "$base/10" -H "Content-Type: application/json" --data-raw '{"tersedia":false}'
curl.exe -i -X PATCH "$base/10" -H "Content-Type: application/json" --data-raw '{"kategori":"unknown"}'
curl.exe -i -X PATCH "$base/10" -H "Content-Type: application/json" --data-raw '{}'
curl.exe -i -X PATCH "$base/10" -H "Content-Type: application/json" --data-raw '{'
curl.exe -i -X PATCH "$base/10" --data-raw '{"tersedia":true}'
curl.exe -i -X PATCH "$base/2147483647" -H "Content-Type: application/json" --data-raw '{"tersedia":false}'
curl.exe -i -X DELETE "$base/1"
curl.exe -i -X DELETE "$base/2147483647"
curl.exe -i -X DELETE "$base/10"
curl.exe -i "$base/10/ulasan"
```

ID `10` di atas adalah ID sementara dari run yang tercatat, dan sudah dihapus.
Untuk mengulang kasus yang mengubah atau menghapus data, buat Item dummy baru
tanpa ulasan dan ganti `10` dengan ID yang baru dikembalikan database. Jangan
gunakan ID seed `1` atau `2` untuk DELETE sukses.

## Bruno CLI dengan assertion status

Koleksi Bruno lokal berada di [`bruno/`](./bruno/). Dijalankan menggunakan
`npx --yes @usebruno/cli run -r --tests-only` dari direktori koleksi.

| No. | Request | Assertion status | Actual | Hasil |
|---:|---|---:|---:|---|
| 1 | `GET /api/v1/item/1` | 200 | 200 | PASS |
| 2 | `GET /api/v1/item/1/ulasan` | 200 | 200 | PASS |
| 3 | `GET /api/v1/item/0` | 400 | 400 | PASS |
| 4 | `GET /api/v1/item/2147483647` | 404 | 404 | PASS |
| 5 | `PATCH /api/v1/item/1` dengan enum tidak valid | 422 | 422 | PASS |
| 6 | `DELETE /api/v1/item/1` dengan ulasan terkait | 409 | 409 | PASS |

Ringkasan runner aktual: 6 request, 6 passed; enam skrip tes assertion status
lulus. Tes DELETE hanya menguji konflik relasi, tidak menghapus data seed.
