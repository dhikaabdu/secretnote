
"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import PageHeader from "@/components/PageHeader";
import FormField from "@/components/FormField";
import { initialNoteFormState } from "@/lib/skema";
import { updateNote } from "../actions";

type EditNoteFormProps = {
  note: {
    id: string;
    title: string;
    category: string;
    content: string;
  };
};

export default function EditNoteForm({ note }: EditNoteFormProps) {
  const updateAction = updateNote.bind(null, note.id);

  const [state, formAction, pending] = useActionState(
    updateAction,
    {
      ...initialNoteFormState,
      values: {
        title: note.title,
        category: note.category,
        content: note.content,
      },
    },
  );

  const [values, setValues] = useState(state.values);

  const [dismissedErrors, setDismissedErrors] = useState<
    Partial<Record<keyof typeof values, boolean>>
  >({});

  const [messageDismissed, setMessageDismissed] = useState(false);
  const [previousState, setPreviousState] = useState(state);

  if (state !== previousState) {
    setPreviousState(state);

    if (state.status === "validated") {
      setValues(state.values);
    }
  }

  function updateField(field: keyof typeof values, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setDismissedErrors((previous) => ({ ...previous, [field]: true }));
    setMessageDismissed(true);
  }

  function prepareSubmission() {
    setDismissedErrors({});
    setMessageDismissed(false);
  }

  const titleError = dismissedErrors.title ? "" : state.errors.title ?? "";
  const categoryError = dismissedErrors.category
    ? ""
    : state.errors.category ?? "";
  const contentError = dismissedErrors.content
    ? ""
    : state.errors.content ?? "";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader showLogout />

      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <Link
          href={`/notes/${note.id}`}
          className="mb-6 inline-block rounded-sm text-sm font-semibold text-indigo-700 hover:underline"
        >
          ← Kembali ke detail catatan
        </Link>

        <PageHeader
          eyebrow="Edit Note"
          title="Edit Catatan"
          description="Perbarui informasi catatan pribadimu."
        />

        <form
          action={formAction}
          onSubmit={prepareSubmission}
          noValidate
          aria-label="Formulir edit catatan"
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <FormField
              id="title"
              name="title"
              label="Judul catatan"
              placeholder="Masukkan judul catatan"
              value={values.title}
              onChange={(event) => updateField("title", event.target.value)}
              error={titleError}
            />
            <p className="mt-1 text-xs text-slate-500">
              Maksimal 100 karakter.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-slate-800"
            >
              Kategori
            </label>

            <select
              id="category"
              name="category"
              value={values.category}
              onChange={(event) =>
                updateField("category", event.target.value)
              }
              aria-invalid={Boolean(categoryError)}
              aria-describedby={categoryError ? "category-error" : undefined}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-200 ${
                categoryError
                  ? "border-red-600"
                  : "border-slate-300 focus:border-indigo-600"
              }`}
            >
              <option value="Personal">Personal</option>
              <option value="Akademik">Akademik</option>
              <option value="Produktivitas">Produktivitas</option>
              <option value="Lainnya">Lainnya</option>
            </select>

            {categoryError && (
              <p id="category-error" role="alert" className="text-sm text-red-700">
                {categoryError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="content"
              className="block text-sm font-semibold text-slate-800"
            >
              Isi catatan
            </label>

            <textarea
              id="content"
              name="content"
              rows={6}
              maxLength={20000}
              value={values.content}
              onChange={(event) =>
                updateField("content", event.target.value)
              }
              aria-invalid={Boolean(contentError)}
              aria-describedby={contentError ? "content-error" : undefined}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-200 ${
                contentError
                  ? "border-red-600"
                  : "border-slate-300 focus:border-indigo-600"
              }`}
              placeholder="Tuliskan isi catatan..."
            />

            <div className="flex justify-between text-xs text-slate-500">
              <span>Maksimal 20.000 karakter.</span>
              <span>
                {values.content.length.toLocaleString("id-ID")}/20.000
              </span>
            </div>

            {contentError && (
              <p id="content-error" role="alert" className="text-sm text-red-700">
                {contentError}
              </p>
            )}
          </div>

          {state.status !== "idle" && !messageDismissed && (
            <p
              role={state.status === "error" ? "alert" : "status"}
              aria-live="polite"
              className={`rounded-xl p-4 text-sm font-medium ${
                state.status === "error"
                  ? "bg-red-50 text-red-800"
                  : "bg-emerald-50 text-emerald-800"
              }`}
            >
              {state.message}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={pending}
              className="rounded-xl bg-indigo-700 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-60"
            >
              {pending ? "Menyimpan..." : "Simpan Perubahan"}
            </button>

            <Link
              href={`/notes/${note.id}`}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
