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
  const item = await prisma.item.findUnique({
    where: {
      judul: "Bank Sampah",
    },
  });

  if (!item) {
    throw new Error("Item Bank Sampah tidak ditemukan.");
  }

  try {
    await prisma.item.delete({
      where: {
        id: item.id,
      },
    });

    console.log("Item berhasil dihapus.");
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      console.log(
        "P2003: Item tidak dapat dihapus karena masih memiliki Ulasan.",
      );
    } else {
      console.error("Terjadi kesalahan yang tidak terduga.");
      throw error;
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });