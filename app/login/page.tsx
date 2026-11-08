
"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginUser, type LoginActionState } from "./actions";

const initialState: LoginActionState = { error: "" };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    loginUser,
    initialState,
  );

  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "1";

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
          <h1 className="text-2xl font-bold">Login SecretNote</h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Masuk menggunakan akun SecretNote yang telah terdaftar.
          </p>

          {registered && (
            <p
              role="status"
              className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800"
            >
              Registrasi berhasil. Silakan masuk menggunakan akun Anda.
            </p>
          )}

          <form action={formAction} className="mt-6 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-slate-800"
              >
                Nama pengguna
              </label>

              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-800"
              >
                Kata sandi
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
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
              {pending ? "Memeriksa..." : "Masuk"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-indigo-700 hover:underline"
            >
              Daftar di sini
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
