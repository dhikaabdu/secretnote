
import { notFound } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { requireDemoSession } from "../../../lib/auth/session";

export const instant = false;

type NoteDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NoteDetailPage({
  params,
}: NoteDetailPageProps) {
  await requireDemoSession();

  const { id } = await params;

  // Validasi ID berupa bilangan bulat positif
  if (!/^[1-9]\d*$/.test(id)) {
    notFound();
  }

  return (
    <>
      <AppHeader showLogout />
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-bold">
          Detail Catatan
        </h1>

        <p className="mt-4">
          ID Catatan: {id}
        </p>
      </main>
    </>
  );
}
