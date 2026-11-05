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
  const itemBaru = await prisma.item.create({
    data: {
      judul: "Uji Skenario 1 SecretNote",
      kategori: "kampus",
      deskripsi: "Item valid untuk pengujian skenario 1 Modul 6.",
      tersedia: true,
    },
  });

  console.log("Item berhasil dibuat:", itemBaru);
}

main()
  .catch((error) => {
    console.error("Pengujian gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
