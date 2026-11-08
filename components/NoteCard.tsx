
import Link from "next/link";
import CategoryBadge from "./CategoryBadge";

type NoteCardProps = {
  id: string;
  title: string;
  category: string;
  description: string;
  updated: string;
};

export default function NoteCard({
  id,
  title,
  category,
  description,
  updated,
}: NoteCardProps) {
  return (
    <Link
      href={`/notes/${id}`}
      className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <article>
        <div className="mb-5 flex items-center justify-between gap-3">
          <CategoryBadge category={category} />
          <span className="text-xs text-slate-400">{updated}</span>
        </div>

        <h2 className="text-lg font-semibold text-slate-900">
          {title}
        </h2>

        <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
          {description}
        </p>

        <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
          Catatan pribadi · Tersimpan di database
        </div>
      </article>
    </Link>
  );
}
