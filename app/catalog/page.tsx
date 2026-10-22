import LatestItems from "@/components/LatestItems";

export default function CatalogPage() {
  return (
    <main id="content" className="flex-1 bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-7xl py-2">
        <h1 className="text-3xl font-bold">Katalog Catatan Contoh</h1>
        <p className="mt-2 text-slate-600">
          Data statis untuk demonstrasi routing dinamis Next.js.
        </p>
        <LatestItems />
      </section>
    </main>
  );
}
