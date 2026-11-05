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
  try {
    await prisma.item.update({
      where: { id: 999999 },
      data: {
        deskripsi: "Uji update terhadap Item yang tidak ditemukan.",
      },
    });

    console.log("UPDATE berhasil.");
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      console.log("P2025: Item yang akan diubah tidak ditemukan.");
    } else {
      throw error;
    }
  }
}

main()
  .catch((error) => {
    console.error("Uji P2025 gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });