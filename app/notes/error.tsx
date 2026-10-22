
"use client";

export default function NotesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div role="alert" className="space-y-3 p-4">
      <h2 className="font-semibold">
        Catatan gagal dimuat.
      </h2>

      <p>{error.message}</p>

      <button
        type="button"
        onClick={() => reset()}
        className="rounded border px-3 py-2"
      >
        Coba lagi
      </button>
    </div>
  );
}
