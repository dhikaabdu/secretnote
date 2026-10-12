
type CategoryBadgeProps = {
  category: string;
};

const categoryStyles: Record<string, string> = {
  Akademik: "bg-violet-100 text-violet-700",
  Personal: "bg-emerald-100 text-emerald-700",
  Produktivitas: "bg-amber-100 text-amber-700",
  Lainnya: "bg-slate-100 text-slate-700",
};

export default function CategoryBadge({
  category,
}: CategoryBadgeProps) {
  const style =
    categoryStyles[category] ?? categoryStyles.Lainnya;

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style}`}
    >
      {category}
    </span>
  );
}
