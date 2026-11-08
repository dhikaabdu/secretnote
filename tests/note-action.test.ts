
import test from "node:test";
import assert from "node:assert/strict";

import { validateNoteFormData } from "../lib/note-validation.ts";

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

test("validasi menerima catatan dengan field dan kategori yang tersedia", () => {
  const result = validateNoteFormData(
    createFormData({
      title: "Catatan kuliah",
      category: "Akademik",
      content: "Ringkasan materi perkuliahan.",
    }),
  );

  assert.equal(result.status, "validated");
  assert.equal(result.message, "Validasi catatan berhasil.");
  assert.deepEqual(result.errors, {});
  assert.equal(result.values.title, "Catatan kuliah");
});

test("validasi menolak judul yang hanya berisi spasi", () => {
  const result = validateNoteFormData(
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

test("validasi menolak isi catatan yang hanya berisi spasi", () => {
  const result = validateNoteFormData(
    createFormData({
      title: "Catatan",
      category: "Personal",
      content: "   ",
    }),
  );

  assert.equal(result.status, "error");
  assert.equal(result.errors.content, "Isi catatan wajib diisi.");
});

test("validasi menolak kategori yang tidak tersedia", () => {
  const result = validateNoteFormData(
    createFormData({
      title: "Catatan",
      category: "Rahasia",
      content: "Isi catatan.",
    }),
  );

  assert.equal(result.status, "error");
  assert.equal(result.errors.category, "Pilih kategori yang tersedia.");
});

test("validasi menolak judul yang tidak dikirim", () => {
  const result = validateNoteFormData(
    createFormData({
      category: "Personal",
      content: "Isi catatan.",
    }),
  );

  assert.equal(result.status, "error");
  assert.equal(result.errors.title, "Judul catatan wajib diisi.");
});

test("validasi menolak kategori yang tidak dikirim", () => {
  const result = validateNoteFormData(
    createFormData({
      title: "Catatan",
      content: "Isi catatan.",
    }),
  );

  assert.equal(result.status, "error");
  assert.equal(result.errors.category, "Pilih kategori yang tersedia.");
});

test("validasi menolak isi catatan yang tidak dikirim", () => {
  const result = validateNoteFormData(
    createFormData({
      title: "Catatan",
      category: "Personal",
    }),
  );

  assert.equal(result.status, "error");
  assert.equal(result.errors.content, "Isi catatan wajib diisi.");
});

test("validasi menolak nilai file pada field teks", () => {
  const formData = createFormData({
    category: "Personal",
    content: "Isi catatan.",
  });

  formData.set("title", new File(["judul"], "judul.txt"));

  const result = validateNoteFormData(formData);

  assert.equal(result.status, "error");
  assert.equal(result.errors.title, "Judul catatan wajib diisi.");
});

test("validasi mengembalikan seluruh kesalahan field sekaligus", () => {
  const result = validateNoteFormData(
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
