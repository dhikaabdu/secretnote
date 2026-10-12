
type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
}: PageHeaderProps) {
  return (
    <header className="mb-8">
      {eyebrow && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
          {eyebrow}
        </p>
      )}

      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>

      <p className="mt-3 max-w-2xl leading-7 text-slate-600">
        {description}
      </p>
    </header>
  );
}
