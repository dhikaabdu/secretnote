
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { appPrisma } from "@/lib/app-prisma";
import { requireUserSession } from "@/lib/auth/user-session";
import { validateNoteFormData } from "@/lib/note-validation";
import type { NoteFormState } from "@/lib/skema";

export async function updateNote(
  noteId: string,
  _previousState: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const session = await requireUserSession();

  const validation = validateNoteFormData(formData);

  if (validation.status === "error") {
    return validation;
  }

  try {
    const result = await appPrisma.note.updateMany({
      where: {
        id: noteId,
        userId: session.userId,
      },
      data: {
        title: validation.values.title,
        category: validation.values.category,
        content: validation.values.content,
      },
    });

    if (result.count === 0) {
      return {
        status: "error",
        message: "Catatan tidak ditemukan atau tidak dapat diakses.",
        errors: {},
        values: validation.values,
      };
    }

    revalidatePath("/notes");
    revalidatePath(`/notes/${noteId}`);

    return {
      status: "validated",
      message: "Catatan berhasil diperbarui.",
      errors: {},
      values: validation.values,
    };
  } catch (error) {
    console.error("Gagal memperbarui catatan:", error);

    return {
      status: "error",
      message: "Catatan gagal diperbarui. Silakan coba kembali.",
      errors: {},
      values: validation.values,
    };
  }
}

export async function deleteNote(noteId: string): Promise<void> {
  const session = await requireUserSession();

  const result = await appPrisma.note.deleteMany({
    where: {
      id: noteId,
      userId: session.userId,
    },
  });

  if (result.count === 0) {
    throw new Error("Catatan tidak ditemukan atau tidak dapat diakses.");
  }

  revalidatePath("/notes");
  redirect("/notes");
}
