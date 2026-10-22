import "server-only";

export type CatalogItem = {
  id: number;
  title: string;
  category: string;
  description: string;
};

const items: CatalogItem[] = [
  {
    id: 1,
    title: "Ide Proyek Semester 5",
    category: "Akademik",
    description: "Contoh catatan untuk menyusun rencana dan target proyek.",
  },
  {
    id: 2,
    title: "Catatan Pribadi",
    category: "Personal",
    description: "Contoh catatan untuk menyimpan pengingat dan hal penting.",
  },
  {
    id: 3,
    title: "Daftar Pekerjaan",
    category: "Produktivitas",
    description: "Contoh daftar tugas yang perlu diselesaikan minggu ini.",
  },
];

export function getItems(): CatalogItem[] {
  return items;
}

export function findItem(id: number): CatalogItem | undefined {
  return items.find((item) => item.id === id);
}
