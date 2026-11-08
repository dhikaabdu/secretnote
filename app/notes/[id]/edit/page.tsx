import { notFound } from "next/navigation";
import { requireUserSession } from "@/lib/auth/user-session";
import { appPrisma } from "@/lib/app-prisma";
import EditNoteForm from "./edit-note-form";

export const instant = false;

type EditNotePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditNotePage({
  params,
}: EditNotePageProps) {
  const session = await requireUserSession();
  const { id } = await params;

  const note = await appPrisma.note.findFirst({
    where: {
      id,
      userId: session.userId,
    },
  });

  if (!note) {
    notFound();
  }

  return (
    <EditNoteForm
      note={{
        id: note.id,
        title: note.title,
        category: note.category ?? "Lainnya",
        content: note.content,
      }}
    />
  );
}