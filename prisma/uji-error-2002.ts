import "dotenv/config";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL belum diatur pada file .env");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const judulUji = "Uji Unique Constraint";

  try {
    // CREATE pertama: seharusnya berhasil
    await prisma.item.create({
      data: {
        judul: judulUji,
        kategori: "kampus",
        deskripsi: "Data pertama untuk uji unique constraint.",
        tersedia: true,
      },
    });

    console.log("CREATE pertama berhasil.");

    // CREATE kedua: sengaja menggunakan judul yang sama
    await prisma.item.create({
      data: {
        judul: judulUji,
        kategori: "kampus",
        deskripsi: "Data kedua dengan judul duplikat.",
        tersedia: true,
      },
    });

    console.log("CREATE kedua berhasil.");
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      console.log("P2002: Judul Item sudah digunakan.");
    } else {
      throw error;
    }
  } finally {
    // Membersihkan data uji agar tidak tertinggal
    await prisma.item.deleteMany({
      where: { judul: judulUji },
    });
  }
}

main()
  .catch((error) => {
    console.error("Uji P2002 gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });