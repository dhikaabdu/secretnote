
"use client";

import { useState } from "react";
import { deleteUser } from "./actions";

type DeleteUserButtonProps = {
  userId: string;
  username: string;
};

export default function DeleteUserButton({
  userId,
  username,
}: DeleteUserButtonProps) {
  const [pending, setPending] = useState(false);

  const deleteAction = deleteUser.bind(null, userId);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus pengguna "${username}"? Seluruh catatan dan sesi milik pengguna ini juga akan dihapus. Tindakan ini tidak dapat dibatalkan.`,
    );

    if (!confirmed) return;

    setPending(true);

    try {
      await deleteAction();
    } catch (error) {
      setPending(false);
      throw error;
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="font-semibold text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Menghapus..." : "Hapus"}
    </button>
  );
}
