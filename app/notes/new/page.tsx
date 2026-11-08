
import { requireUserSession } from "@/lib/auth/user-session";
import NewNoteForm from "./note-form";

export const instant = false;

export default async function NewNotePage() {
  await requireUserSession();

  return <NewNoteForm />;
}
