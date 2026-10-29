import test from "node:test";
import assert from "node:assert/strict";

import { validateNewNote } from "../app/notes/new/actions.ts";
import { initialNoteFormState } from "../lib/skema.ts";

function createFormData(
  values: Partial<Record<"title" | "category" | "content", string>> = {},
): FormData {
  const formData = new FormData();

  for (const field of ["title", "category", "content"] as const) {
    const value = values[field];
    if (value !== undefined) {
      formData.set(field, value);
    }
  }

  return formData;
}

test("validasi menerima catatan dengan field dan kategori yang tersedia", async () => {
  const result = await validateNewNote(
    initialNoteFormState,
    createFormData({
      title: "Catatan kuliah",
      category: "Akademik",
      content: "Ringkasan materi perkuliahan.",
    }),
  );

  assert.equal(result.status, "validated");
  assert.match(result.message, /belum disimpan/);
  assert.deepEqual(result.errors, {});
});

test("validasi server menolak judul yang hanya berisi spasi", async () => {
  const result = await validateNewNote(
    initialNoteFormState,
    createFormData({
      title: "   ",
      category: "Personal",
      content: "Isi catatan yang valid.",
    }),
  );

  assert.equal(result.status, "error");
  assert.equal(result.errors.title, "Judul catatan wajib diisi.");
  assert.equal(result.values.title, "   ");
});

test("validasi server menolak isi catatan yang hanya berisi spasi", async () => {
  const result = await validateNewNote(
    initialNoteFormState,
    createFormData({
      title: "Catatan",
      category: "Personal",
      content: "   ",
    }),
  );

  assert.equal(result.status, "error");
  assert.equal(result.errors.content, "Isi catatan wajib diisi.");
});

test("validasi server menolak kategori yang tidak tersedia di formulir", async () => {
  const result = await validateNewNote(
    initialNoteFormState,
    createFormData({
      title: "Catatan",
      category: "Rahasia",
      content: "Isi catatan.",
    }),
  );

  assert.equal(result.status, "error");
  assert.equal(result.errors.category, "Pilih kategori yang tersedia.");
  assert.equal(result.values.category, "Rahasia");
});

test("validasi server menolak judul yang tidak dikirim", async () => {
  const result = await validateNewNote(
    initialNoteFormState,
    createFormData({
      category: "Personal",
      content: "Isi catatan.",
    }),
  );

  assert.equal(result.status, "error");
  assert.equal(result.errors.title, "Judul catatan wajib diisi.");
});

test("validasi server menolak kategori yang tidak dikirim", async () => {
  const result = await validateNewNote(
    initialNoteFormState,
    createFormData({
      title: "Catatan",
      content: "Isi catatan.",
    }),
  );

  assert.equal(result.status, "error");
  assert.equal(result.errors.category, "Pilih kategori yang tersedia.");
});

test("validasi server menolak isi catatan yang tidak dikirim", async () => {
  const result = await validateNewNote(
    initialNoteFormState,
    createFormData({
      title: "Catatan",
      category: "Personal",
    }),
  );

  assert.equal(result.status, "error");
  assert.equal(result.errors.content, "Isi catatan wajib diisi.");
});

test("validasi server menolak nilai file pada field teks", async () => {
  const formData = createFormData({
    category: "Personal",
    content: "Isi catatan.",
  });
  formData.set("title", new File(["judul"], "judul.txt"));

  const result = await validateNewNote(initialNoteFormState, formData);

  assert.equal(result.status, "error");
  assert.equal(result.errors.title, "Judul catatan wajib diisi.");
});

test("validasi server tidak menyatakan sukses jika ada lebih dari satu field salah", async () => {
  const result = await validateNewNote(
    initialNoteFormState,
    createFormData({
      title: "",
      category: "Tidak ada",
      content: "",
    }),
  );

  assert.equal(result.status, "error");
  assert.deepEqual(Object.keys(result.errors).sort(), [
    "category",
    "content",
    "title",
  ]);
});
