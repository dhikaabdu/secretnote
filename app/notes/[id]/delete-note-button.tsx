
"use client";

import { useState } from "react";
import { deleteNote } from "./actions";

type DeleteNoteButtonProps = {
  noteId: string;
};

export default function DeleteNoteButton({
  noteId,
}: DeleteNoteButtonProps) {
  const [pending, setPending] = useState(false);
  const deleteAction = deleteNote.bind(null, noteId);

  return (
    <form
      action={async () => {
        const confirmed = window.confirm(
          "Apakah kamu yakin ingin menghapus catatan ini? Tindakan ini tidak dapat dibatalkan.",
        );

        if (!confirmed) return;

        setPending(true);
        await deleteAction();
      }}
    >
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Menghapus..." : "Hapus Catatan"}
      </button>
    </form>
  );
}
