
"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import PageHeader from "@/components/PageHeader";
import FormField from "@/components/FormField";

export default function NewNotePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({
    title: "",
    content: "",
  });
  const [success, setSuccess] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = {
      title: title.trim() ? "" : "Judul catatan wajib diisi.",
      content: content.trim() ? "" : "Isi catatan wajib diisi.",
    };

    setErrors(nextErrors);
    setSuccess(false);

    if (nextErrors.title) {
      titleRef.current?.focus();
      return;
    }

    if (nextErrors.content) {
      contentRef.current?.focus();
      return;
    }

    setSuccess(true);
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    setErrors((previous) => ({
      ...previous,
      title: value.trim() ? "" : previous.title,
    }));
    setSuccess(false);
  }

  function handleContentChange(value: string) {
    setContent(value);
    setErrors((previous) => ({
      ...previous,
      content: value.trim() ? "" : previous.content,
    }));
    setSuccess(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader />

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
          onSubmit={handleSubmit}
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
              value={title}
              onChange={(event) =>
                handleTitleChange(event.target.value)
              }
              error={errors.title}
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
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setSuccess(false);
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
            >
              <option value="Personal">Personal</option>
              <option value="Akademik">Akademik</option>
              <option value="Produktivitas">Produktivitas</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="content"
              className="block text-sm font-semibold text-slate-800"
            >
              Isi catatan
            </label>
            <textarea
              ref={contentRef}
              id="content"
              name="content"
              rows={6}
              value={content}
              onChange={(event) =>
                handleContentChange(event.target.value)
              }
              aria-invalid={Boolean(errors.content)}
              aria-describedby={
                errors.content ? "content-error" : undefined
              }
              className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-200 ${
                errors.content
                  ? "border-red-600 focus:border-red-600"
                  : "border-slate-300 focus:border-indigo-600"
              }`}
              placeholder="Tuliskan isi catatan..."
            />
            {errors.content && (
              <p
                id="content-error"
                role="alert"
                className="text-sm font-medium text-red-700"
              >
                {errors.content}
              </p>
            )}
          </div>

          {success && (
            <p
              role="status"
              aria-live="polite"
              className="rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800"
            >
              Validasi berhasil! Catatan belum disimpan secara permanen.
            </p>
          )}

          <button
            type="submit"
            className="rounded-xl bg-indigo-700 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
          >
            Validasi catatan
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
