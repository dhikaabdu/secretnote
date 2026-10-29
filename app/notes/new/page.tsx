
import { requireDemoSession } from "../../../lib/auth/session";
import NewNoteForm from "./note-form";

export const instant = false;

export default async function NewNotePage() {
  await requireDemoSession();
  return <NewNoteForm />;
}
