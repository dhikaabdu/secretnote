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
  // Ambil Item yang sudah ada
  const item = await prisma.item.findUnique({
    where: {
      judul: "Bank Sampah",
    },
  });

  if (!item) {
    throw new Error("Item Bank Sampah tidak ditemukan. Jalankan seed terlebih dahulu.");
  }

  // Tambahkan Ulasan yang terhubung ke Item
  const ulasanBaru = await prisma.ulasan.create({
    data: {
      nama: "Penguji Relasi",
      nilai: 5,
      komentar: "Uji relasi Item dan Ulasan berhasil.",
      itemId: item.id,
    },
  });

  console.log("CREATE Ulasan berhasil:", ulasanBaru);

  // Ambil Item beserta Ulasannya
  const itemDenganUlasan = await prisma.item.findUnique({
    where: {
      id: item.id,
    },
    include: {
      ulasan: true,
    },
  });

  console.log("READ relasi berhasil:", itemDenganUlasan);
}

main()
  .catch((error) => {
    console.error("Uji relasi gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });