
"use server";

import { requireUserSession } from "@/lib/auth/user-session";
import { appPrisma } from "@/lib/app-prisma";
import { validateNoteFormData } from "@/lib/note-validation";
import type { NoteFormState } from "@/lib/skema";

export async function validateNewNote(
  _previousState: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const session = await requireUserSession();

  const validation = validateNoteFormData(formData);

  if (validation.status === "error") {
    return validation;
  }

  try {
    await appPrisma.note.create({
      data: {
        title: validation.values.title,
        category: validation.values.category,
        content: validation.values.content,
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
      values: validation.values,
    };
  }
}
