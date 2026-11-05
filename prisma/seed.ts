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
  const itemEnergi = await prisma.item.upsert({
    where: { judul: "Panel Surya Kampus" },
    update: {},
    create: {
      judul: "Panel Surya Kampus",
      kategori: "energi",
      deskripsi: "Pemanfaatan panel surya untuk kebutuhan energi kampus.",
      tersedia: true,
      gambar: null,
    },
  });

  const itemLingkungan = await prisma.item.upsert({
    where: { judul: "Bank Sampah" },
    update: {},
    create: {
      judul: "Bank Sampah",
      kategori: "lingkungan",
      deskripsi: "Program pengelolaan sampah dan daur ulang.",
      tersedia: true,
      gambar: null,
    },
  });

  await prisma.ulasan.upsert({
    where: {
      itemId_nama: {
        itemId: itemEnergi.id,
        nama: "Mahasiswa A",
      },
    },
    update: {},
    create: {
      nama: "Mahasiswa A",
      nilai: 5,
      komentar: "Program energi yang bermanfaat.",
      itemId: itemEnergi.id,
    },
  });

  await prisma.ulasan.upsert({
    where: {
      itemId_nama: {
        itemId: itemLingkungan.id,
        nama: "Mahasiswa B",
      },
    },
    update: {},
    create: {
      nama: "Mahasiswa B",
      nilai: 4,
      komentar: "Mendukung lingkungan kampus yang lebih bersih.",
      itemId: itemLingkungan.id,
    },
  });

  console.log("Seed data Item dan Ulasan berhasil dijalankan.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });