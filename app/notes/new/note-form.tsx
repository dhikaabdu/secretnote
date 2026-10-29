"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import PageHeader from "@/components/PageHeader";
import FormField from "@/components/FormField";
import { initialNoteFormState } from "@/lib/skema";
import { validateNewNote } from "./actions";

export default function NewNoteForm() {
  const [state, formAction, pending] = useActionState(
    validateNewNote,
    initialNoteFormState,
  );
  const [values, setValues] = useState(initialNoteFormState.values);
  const [dismissedErrors, setDismissedErrors] = useState<
    Partial<Record<keyof typeof values, boolean>>
  >({});
  const [messageDismissed, setMessageDismissed] = useState(false);

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
          href="/notes"
          className="mb-6 inline-block rounded-sm text-sm font-semibold text-indigo-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-700"
        >
          ← Kembali ke daftar catatan
        </Link>

        <PageHeader
          eyebrow="New Note"
          title="Buat Catatan Baru"
          description="Tambahkan catatan pribadi ke ruang kerjamu."
        />

        <form
          action={formAction}
          onSubmit={prepareSubmission}
          noValidate
          aria-label="Formulir pembuatan catatan"
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
                  ? "border-red-600 focus:border-red-600"
                  : "border-slate-300 focus:border-indigo-600"
              }`}
            >
              <option value="Personal">Personal</option>
              <option value="Akademik">Akademik</option>
              <option value="Produktivitas">Produktivitas</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            {categoryError && (
              <p
                id="category-error"
                role="alert"
                className="text-sm font-medium text-red-700"
              >
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
              value={values.content}
              onChange={(event) =>
                updateField("content", event.target.value)
              }
              aria-invalid={Boolean(contentError)}
              aria-describedby={
                contentError ? "content-error" : undefined
              }
              className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-200 ${
                contentError
                  ? "border-red-600 focus:border-red-600"
                  : "border-slate-300 focus:border-indigo-600"
              }`}
              placeholder="Tuliskan isi catatan..."
            />
            {contentError && (
              <p
                id="content-error"
                role="alert"
                className="text-sm font-medium text-red-700"
              >
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

          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-indigo-700 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
          >
            {pending ? "Memvalidasi..." : "Validasi catatan"}
          </button>
        </form>

        <p className="mt-4 text-xs leading-5 text-slate-600">
          Versi awal menggunakan data contoh. Catatan belum disimpan
          secara permanen dan belum dienkripsi.
        </p>
      </div>
    </main>
  );
}
