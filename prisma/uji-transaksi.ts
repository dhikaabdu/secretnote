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
  const judulUji = "Uji Transaction Rollback";

  try {
    await prisma.$transaction(async (tx) => {
      // Membuat Item sementara di dalam transaksi
      await tx.item.create({
        data: {
          judul: judulUji,
          kategori: "kampus",
          deskripsi: "Item ini seharusnya dibatalkan melalui rollback.",
          tersedia: true,
        },
      });

      console.log("Item sementara berhasil dibuat di dalam transaksi.");

      // Memunculkan error secara sengaja untuk memicu rollback
      throw new Error("Uji rollback: batalkan transaksi.");
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Uji rollback: batalkan transaksi."
    ) {
      console.log("Transaksi dibatalkan karena error yang disengaja.");
    } else {
      throw error;
    }
  }

  // Memastikan Item tidak tersimpan di database
  const itemSetelahRollback = await prisma.item.findUnique({
    where: { judul: judulUji },
  });

  if (itemSetelahRollback === null) {
    console.log("ROLLBACK berhasil: Item tidak tersimpan di database.");
  } else {
    throw new Error("ROLLBACK gagal: Item masih ditemukan di database.");
  }
}

main()
  .catch((error) => {
    console.error("Uji transaksi gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });