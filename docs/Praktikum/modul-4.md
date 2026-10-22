# Dokumen Teknis Modul 4: Next.js App Router

**Nama/NIM:** Andhika Abdu Raafi Wicaksono 
**Repositori:** https://github.com/dhikaabdu/secretnote
**Versi Next.js:** 16.4.0 
**Mode Cache Components:** Aktif, berdasarkan konfigurasi cacheComponents: true pada next.config.ts.
**Partial Prefetching**: Aktif, berdasarkan konfigurasi partialPrefetch: true pada next.config.ts.
**Agent Feedback**: Eksperimen diaktifkan melalui experimental.agentFeedback: true.

## 1. Peta Rute

Berdasarkan struktur folder proyek dan keluaran `npm run build`, rute SecretNote yang teridentifikasi adalah:

| URL | Berkas di `app/` | Jenis rute | Isi halaman |
|---|---|---|---|
| `/` | `app/page.tsx` | Statis | Halaman utama SecretNote. |
| `/notes` | `app/notes/page.tsx` | Statis | Halaman daftar catatan. |
| `/notes/new` | `app/notes/new/page.tsx` | Statis | Halaman pembuatan catatan baru. |
| `/notes/[id]` | `app/notes/[id]/page.tsx` | Dinamis | Halaman detail catatan berdasarkan ID. |
| `/_not-found` | Rute internal Next.js | Fallback | Halaman ketika rute tidak ditemukan. |

### Keluaran build

Pada terminal, build menggunakan Next.js 16.4.0 (Turbopack). Kompilasi berhasil, pemeriksaan TypeScript selesai, dan pembuatan halaman statis mencapai 7/7.

Potongan tabel rute yang terlihat:

```text
Route (app)
├ ○ /
├ ○ /_not-found
├ ○ /notes
├ ƒ /notes/[id]
└ ○ /notes/new
```

Keterangan: `○` menunjukkan halaman statis. Simbol `ƒ` menunjukkan rute dinamis atau rute yang dirender saat permintaan, sesuai keterangan keluaran build yang digunakan.

## 2. Layout, Template, dan Berkas Khusus

### 2.1 Struktur folder `app/`

```text
app/
├── notes/
│   ├── [id]/
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── new/
│   │   └── page.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── globals.css
├── layout.tsx
└── page.tsx
```

Struktur tersebut disusun berdasarkan folder yang terlihat pada VS Code. Keberadaan `app/not-found.tsx`, `app/error.tsx`, dan `template.tsx` pada akar aplikasi perlu diperiksa kembali sebelum dokumen dikumpulkan.

### 2.2 Fungsi berkas khusus

| Berkas | Fungsi |
|---|---|
| `app/notes/[id]/loading.tsx` | Menampilkan tampilan sementara ketika halaman detail catatan sedang dimuat. |
| `app/notes/error.tsx` | Menangani galat pada segmen `/notes`. Berkas ini harus menggunakan `"use client"`. |
| `app/notes/not-found.tsx` | Menampilkan halaman tidak ditemukan untuk segmen `/notes` ketika mekanisme `notFound()` dipanggil. |
| `app/layout.tsx` | Menyediakan layout utama yang membungkus halaman aplikasi. |
| `template.tsx` | Perlu diperiksa apakah sudah tersedia dan digunakan dalam proyek. |

### 2.3 Hasil pengujian layout dan template

**Status: Perlu diuji dan dilengkapi tangkapan layar.**

Langkah pengujian:

1. Buka halaman `/notes`.
2. Jika tersedia input dengan state lokal, masukkan teks pada input tersebut.
3. Buka halaman detail catatan melalui `/notes/[id]`.
4. Kembali ke `/notes` dan amati apakah state tetap dipertahankan.
5. Ulangi pengujian pada komponen di dalam `template.tsx`, jika template sudah diterapkan.
6. Simpan tangkapan layar sebelum dan sesudah navigasi.

Layout dipertahankan ketika navigasi pada segmen terkait, sedangkan template dipasang ulang ketika segmen anak berubah. Akibatnya, state lokal pada komponen di dalam template dapat kembali ke nilai awal.

Perilaku tersebut merupakan acuan pengujian. Hasil aktual SecretNote harus dicatat setelah pengujian dilakukan.

### 2.4 Pengujian loading dan error

**Status: Perlu dilengkapi dengan bukti mode development dan production.**

- **Loading:** uji pemuatan halaman dan pastikan tampilan dari `loading.tsx` muncul ketika diperlukan.
- **Error development:** picu galat uji yang terkontrol dan periksa tampilan fallback dari `error.tsx`.
- **Error production:** jalankan build terbaru, mulai aplikasi menggunakan `npm start`, lalu amati tampilan galat yang muncul.
- Simpan tangkapan layar untuk masing-masing pengujian.
- Hapus kembali kode pemicu galat uji setelah pengujian selesai.

## 3. Rute Dinamis dan Validasi `params`

Rute detail catatan berada pada `app/notes/[id]/page.tsx` dan digunakan untuk mengakses catatan berdasarkan ID melalui URL `/notes/{id}`.

Pada Next.js 15 dan 16, `params` pada Server Component berbentuk `Promise`, sehingga perlu diakses menggunakan `await params`.

Contoh pola pengaksesan:

```tsx
export default async function NoteDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Validasi ID dan pemeriksaan keberadaan catatan
  // dilakukan sebelum detail ditampilkan.
}
```

Nilai ID dari URL harus diperlakukan sebagai string yang berasal dari masukan pengguna. Format ID perlu divalidasi dan keberadaan catatan perlu diperiksa sebelum halaman detail ditampilkan. Apabila ID tidak valid atau catatan tidak ditemukan, `notFound()` dari `next/navigation` dapat digunakan untuk menampilkan halaman not-found yang sesuai.

### 3.1 Tabel pengujian URL

Jalankan server menggunakan `npm run dev`, kemudian uji setiap URL dengan perintah berikut di PowerShell.

```powershell
curl.exe -s -o NUL -w "%{http_code}`n" http://localhost:3000/notes/1
curl.exe -s -o NUL -w "%{http_code}`n" http://localhost:3000/notes/abc
curl.exe -s -o NUL -w "%{http_code}`n" http://localhost:3000/notes/999
```

| URL | Hasil yang diharapkan | Hasil aktual | Kode status |
|---|---|---|---|
| `/notes/1` | Detail catatan ditampilkan apabila ID tersebut tersedia. | Perlu diisi setelah pengujian. | Perlu diisi dari terminal. |
| `/notes/abc` | Halaman tidak ditemukan apabila format ID ditolak. | Perlu diisi setelah pengujian. | Perlu diisi dari terminal. |
| `/notes/999` | Halaman tidak ditemukan apabila catatan dengan ID tersebut tidak tersedia. | Perlu diisi setelah pengujian. | Perlu diisi dari terminal. |
| `/notes/new` | Halaman pembuatan catatan baru ditampilkan. | Perlu diuji. | Perlu diisi dari terminal. |

Tangkapan layar sebelumnya menunjukkan perintah pengujian untuk `/notes/1`, `/notes/abc`, dan `/notes/999`, tetapi kode status yang dihasilkan belum terlihat. Karena itu, kolom hasil aktual perlu dilengkapi setelah perintah dijalankan kembali.

Perlu diperhatikan bahwa ketika `notFound()` dipanggil setelah streaming dimulai, respons HTTP dapat berstatus `200` meskipun tampilan not-found ditampilkan. Catat hasil aktual dari terminal dan browser.

## 4. Pembagian Server dan Client Components

Pada Next.js App Router, komponen secara default merupakan Server Component. Client Component digunakan untuk komponen yang memerlukan state, event handler, hook klien, atau API browser.

| Komponen/berkas | Jenis | Alasan teknis |
|---|---|---|
| `app/layout.tsx` | Server Component secara default; perlu verifikasi kode | Menyediakan layout utama aplikasi. |
| `app/page.tsx` | Server Component secara default; perlu verifikasi kode | Menampilkan halaman utama jika tidak menggunakan `"use client"`. |
| `app/notes/page.tsx` | Perlu diperiksa dari kode aktual | Menampilkan daftar catatan; kebutuhan interaksi menentukan pemisahan komponen klien. |
| `app/notes/[id]/page.tsx` | Server Component jika tidak menggunakan `"use client"` | Mengakses dan memvalidasi parameter rute pada server. |
| `app/notes/new/page.tsx` | Perlu diperiksa dari kode aktual | Menampilkan halaman pembuatan catatan; interaksi formulir dapat dipisahkan ke Client Component. |
| `app/notes/[id]/loading.tsx` | Server Component secara default | Menampilkan fallback loading tanpa memerlukan state klien jika hanya berupa markup. |
| `app/notes/error.tsx` | Client Component | Error boundary memerlukan `"use client"` dan mekanisme pemulihan. |
| `components/AppHeader.tsx` | Perlu diperiksa dari kode aktual | Dapat berupa Server Component jika hanya menampilkan markup; gunakan Client Component jika membutuhkan hook atau event klien. |
| `components/CategoryBadge.tsx` | Perlu diperiksa dari kode aktual | Jika hanya menampilkan label kategori, dapat berupa Server Component. |
| `components/FormField.tsx` | Perlu diperiksa dari kode aktual | Jenis komponen bergantung pada penggunaan state dan event handler. |
| `components/NoteCard.tsx` | Perlu diperiksa dari kode aktual | Jika hanya menampilkan informasi catatan, dapat berupa Server Component. |
| `components/PageHeader.tsx` | Perlu diperiksa dari kode aktual | Jika hanya menampilkan judul dan subjudul, dapat berupa Server Component. |

Klasifikasi final harus dicocokkan dengan kode aktual, khususnya keberadaan `"use client"` dan penggunaan hook pada setiap berkas.

### 4.1 Pengujian `server-only`

**Status: Belum ada bukti hasil pengujian.**

Pengujian ini dilakukan apabila proyek memiliki modul data yang hanya boleh dijalankan di server.

1. Tambahkan `import "server-only"` pada modul data server.
2. Coba impor modul tersebut dari Client Component.
3. Jalankan pemeriksaan atau build dan catat pesan galat yang muncul.
4. Hapus kembali impor pengujian.
5. Pastikan proyek kembali lolos pemeriksaan.

Jika SecretNote belum memiliki modul data server yang sesuai, catat bahwa pengujian ini belum diterapkan pada struktur proyek saat ini.

## 5. Verifikasi

Berdasarkan tangkapan layar terminal yang tersedia, `npm run build` berhasil dijalankan menggunakan Next.js 16.4.0 (Turbopack). Keluaran menunjukkan kompilasi berhasil, pemeriksaan TypeScript selesai, pengumpulan data halaman selesai, dan 7/7 halaman statis berhasil dibuat.

| Perintah | Hasil yang diketahui | Tindak lanjut |
|---|---|---|
| `npx tsc --noEmit` | Terminal kembali ke prompt tanpa pesan galat yang terlihat pada tangkapan layar terakhir. | Jalankan kembali dan simpan bukti hasil akhir. |
| `npm run lint` | Perintah lint menjalankan ESLint; hasil akhir perlu dipastikan. | Pastikan proses selesai tanpa galat. |
| `npm run build` | Berhasil pada tangkapan layar yang tersedia. | Jalankan ulang setelah semua perubahan final. |

Perintah verifikasi:

```powershell
npx tsc --noEmit
npm run lint
npm run build
```

Jalankan satu per satu dan tunggu setiap perintah selesai. Simpan tangkapan layar keluaran terbaru untuk bukti pengumpulan.

## 6. Kendala dan Penyelesaian

| Kendala/temuan | Penyelesaian atau tindak lanjut |
|---|---|
| Pengujian rute dinamis mencakup ID valid, format ID tidak valid, dan ID yang tidak tersedia. | Ulangi perintah `curl.exe` satu per satu dan catat kode status serta tampilan aktual. |
| Berkas `loading.tsx` telah tersedia pada `app/notes/[id]/`. | Uji apakah tampilan loading benar-benar muncul ketika halaman dimuat. |
| Berkas `error.tsx` dan `not-found.tsx` terlihat pada segmen `app/notes/`. | Periksa implementasi dan uji masing-masing perilaku. Pastikan error boundary memakai `"use client"`. |
| Build berhasil pada tangkapan layar yang tersedia. | Jalankan kembali TypeScript, lint, dan build setelah perubahan akhir. |
| Bukti pengujian layout versus template belum tersedia. | Lakukan pengujian dan simpan tangkapan layar jika template telah diterapkan. |
| Bukti pengujian `server-only` belum tersedia. | Lakukan pengujian apabila modul data server telah diterapkan; jika belum, catat sebagai belum dilakukan. |

## 7. Catatan Pemanfaatan AI

**Alat:** ChatGPT.

**Bagian yang digunakan:** Membantu menyusun kerangka dan draf Dokumen Teknis Modul 4 berdasarkan instruksi pada modul praktikum, struktur folder yang terlihat pada tangkapan layar VS Code, serta keluaran terminal yang diberikan.

**Perintah utama:** Meminta bantuan penyusunan Dokumen Teknis untuk bagian H Modul 4.

**Cara memverifikasi:** Cocokkan path file dan implementasi dengan source code SecretNote, jalankan `npx tsc --noEmit`, `npm run lint`, `npm run build`, serta perintah `curl.exe`. Lengkapi hasil aktual dan tangkapan layar sebelum dokumen dikumpulkan.

AI digunakan untuk membantu penyusunan dokumentasi, bukan sebagai pengganti bukti pengujian. Bagian yang belum memiliki bukti diberi tanda *Perlu diverifikasi* agar tidak dianggap sebagai hasil aktual.
