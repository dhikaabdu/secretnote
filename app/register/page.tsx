
"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  registerUser,
  type RegisterActionState,
} from "./actions";

const initialState: RegisterActionState = {
  error: "",
};

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(
    registerUser,
    initialState,
  );

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="text-sm font-semibold text-indigo-700 hover:underline"
        >
          SecretNote
        </Link>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold">Buat Akun SecretNote</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Daftarkan akun untuk mulai menyimpan catatan pribadi dengan aman.
          </p>

          <form action={formAction} className="mt-6 space-y-5">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                minLength={3}
                maxLength={30}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={12}
                maxLength={128}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
              />
              <p className="text-xs text-slate-500">
                Minimal 12 karakter dan maksimal 128 karakter.
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold"
              >
                Konfirmasi Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={12}
                maxLength={128}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            {state.error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-800"
              >
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-indigo-700 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Mendaftarkan..." : "Daftar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-700 hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
