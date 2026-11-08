import { ambilDaftarItem } from "@/lib/praktikum-data";

export default async function ItemList() {
  const items = await ambilDaftarItem();

  if (items.length === 0) {
    return (
      <p className="mt-5 text-gray-500">
        Belum ada data Item. Jalankan seed terlebih dahulu.
      </p>
    );
  }

  return (
    <div className="mt-5 space-y-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-lg border border-gray-200 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">{item.judul}</h3>
              <p className="text-sm text-gray-500">
                Kategori: {item.kategori}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-sm ${
                item.tersedia
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {item.tersedia ? "Tersedia" : "Tidak tersedia"}
            </span>
          </div>

          <p className="mt-3 text-gray-700">{item.deskripsi}</p>

          <div className="mt-4 border-t border-gray-100 pt-3">
            <h4 className="font-medium">
              Ulasan ({item.ulasan.length})
            </h4>

            {item.ulasan.length === 0 ? (
              <p className="mt-2 text-sm text-gray-500">
                Belum ada ulasan.
              </p>
            ) : (
              <ul className="mt-2 space-y-2">
                {item.ulasan.map((ulasan) => (
                  <li
                    key={ulasan.id}
                    className="rounded-md bg-gray-50 p-3 text-sm"
                  >
                    <p className="font-medium">
                      {ulasan.nama} · Nilai {ulasan.nilai}/5
                    </p>
                    <p className="mt-1 text-gray-600">
                      {ulasan.komentar}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
