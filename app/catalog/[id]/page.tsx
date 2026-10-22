import Link from "next/link";
import { notFound } from "next/navigation";
import { findItem, getItems } from "@/lib/data";

export function generateStaticParams() {
  return getItems().map((item) => ({ id: String(item.id) }));
}

export default async function CatalogItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!/^[1-9]\d*$/.test(id)) {
    notFound();
  }

  const item = findItem(Number(id));

  if (!item) {
    notFound();
  }

  return (
    <main id="content" className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <Link
        href="/catalog"
        className="text-sm font-semibold text-indigo-700 hover:underline"
      >
        ← Kembali ke katalog
      </Link>
      <article className="mt-6">
        <p className="text-sm font-medium text-indigo-700">{item.category}</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{item.title}</h1>
        <p className="mt-4 leading-7 text-slate-600">{item.description}</p>
      </article>
    </main>
  );
}
