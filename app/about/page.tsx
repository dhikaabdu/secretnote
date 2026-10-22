import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "Tentang | SecretNote",
  description: "Pelajari tentang SecretNote dan tujuan pengembangannya.",
};

export default function AboutPage() {
  return (
    <>
      <AppHeader />
      <main id="content" className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8">
        <h1 className="text-3xl font-bold text-slate-900">Tentang SecretNote</h1>
        <p className="mt-4 leading-7 text-slate-600">
          SecretNote adalah ruang kerja untuk mengelola catatan akademik,
          personal, dan produktivitas. Aplikasi ini dikembangkan sebagai proyek
          pembelajaran dan saat ini masih menggunakan data contoh.
        </p>
      </main>
    </>
  );
}
