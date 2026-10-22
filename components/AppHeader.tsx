
import Link from "next/link";
import { Suspense } from "react";
import NavLinks from "@/components/NavLinks";

export default function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white">
            🔐
          </div>

          <div>
            <p className="text-xl font-bold tracking-tight text-slate-900">
              SecretNote
            </p>
            <p className="text-xs text-slate-500">
              Secure Personal Notes
            </p>
          </div>
        </Link>

        <nav aria-label="Navigasi utama" className="flex items-center gap-4">
          <Suspense
            fallback={
              <span className="text-sm font-medium text-slate-600">
                Navigasi
              </span>
            }
          >
            <NavLinks />
          </Suspense>

          <Link
            href="/notes/new"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Catatan
          </Link>
        </nav>
      </div>
    </header>
  );
}
