"use server";

import {
  noteSchema,
  type NoteFormState,
} from "../../../lib/skema.ts";

function getStringValue(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

export async function validateNewNote(
  _previousState: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const rawValues = {
    title: formData.get("title"),
    category: formData.get("category"),
    content: formData.get("content"),
  };

  const values = {
    title: getStringValue(rawValues.title),
    category: getStringValue(rawValues.category),
    content: getStringValue(rawValues.content),
  };

  const result = noteSchema.safeParse(rawValues);

  if (!result.success) {
    const errors: NoteFormState["errors"] = {};

    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (
        (field === "title" || field === "category" || field === "content") &&
        !errors[field]
      ) {
        errors[field] = issue.message;
      }
    }

    return {
      status: "error",
      message: "Periksa kembali isian yang ditandai.",
      errors,
      values,
    };
  }

  return {
    status: "validated",
    message:
      "Validasi berhasil. Catatan belum disimpan karena penyimpanan catatan belum tersedia.",
    errors: {},
    values,
  };
}
