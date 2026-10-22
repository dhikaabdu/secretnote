import Link from "next/link";
import type { CatalogItem } from "@/lib/data";

export default function ItemCard({ item }: { item: CatalogItem }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
        {item.category}
      </p>
      <h2 className="mt-2 text-lg font-semibold text-slate-900">
        <Link
          href={`/catalog/${item.id}`}
          className="rounded-sm hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
        >
          {item.title}
        </Link>
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {item.description}
      </p>
    </article>
  );
}
