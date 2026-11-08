
"use server";

import { requireUserSession } from "@/lib/auth/user-session";
import { appPrisma } from "@/lib/app-prisma";
import {
  noteSchema,
  type NoteFormState,
} from "@/lib/skema";

function getStringValue(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

export async function validateNewNote(
  _previousState: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const session = await requireUserSession();

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
        (field === "title" ||
          field === "category" ||
          field === "content") &&
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

  try {
    await appPrisma.note.create({
      data: {
        title: result.data.title,
        category: result.data.category,
        content: result.data.content,
        userId: session.userId,
      },
    });

    return {
      status: "validated",
      message: "Catatan berhasil disimpan.",
      errors: {},
      values: {
        title: "",
        category: "Personal",
        content: "",
      },
    };
  } catch (error) {
    console.error("Gagal menyimpan catatan:", error);

    return {
      status: "error",
      message: "Catatan gagal disimpan. Silakan coba kembali.",
      errors: {},
      values,
    };
  }
}
