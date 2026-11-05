import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL belum diatur pada file .env");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // CREATE: tambah Item baru
  const itemBaru = await prisma.item.create({
    data: {
      judul: "Uji CRUD SecretNote",
      kategori: "kampus",
      deskripsi: "Data uji untuk memeriksa operasi CRUD Prisma.",
      tersedia: true,
    },
  });

  console.log("CREATE berhasil:", itemBaru);

  // READ: ambil Item yang baru dibuat
  const itemDitemukan = await prisma.item.findUnique({
    where: { id: itemBaru.id },
  });

  console.log("READ berhasil:", itemDitemukan);

  // UPDATE: ubah deskripsi Item
  const itemDiubah = await prisma.item.update({
    where: { id: itemBaru.id },
    data: {
      deskripsi: "Deskripsi berhasil diperbarui melalui uji CRUD.",
    },
  });

  console.log("UPDATE berhasil:", itemDiubah);

  // DELETE: hapus Item uji
  const itemDihapus = await prisma.item.delete({
    where: { id: itemBaru.id },
  });

  console.log("DELETE berhasil:", itemDihapus);
}

main()
  .catch((error) => {
    console.error("Uji CRUD gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });