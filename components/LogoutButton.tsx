"use client";

import { logoutDemo } from "@/app/login/actions";

export default function LogoutButton() {
  return (
    <form action={logoutDemo}>
      <button
        type="submit"
        className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-600 hover:text-indigo-700"
      >
        Keluar
      </button>
    </form>
  );
}
