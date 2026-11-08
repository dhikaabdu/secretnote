
import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/app-prisma/client";

const globalForAppPrisma = globalThis as unknown as {
  appPrisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({
  connectionString: process.env.APP_DATABASE_URL!,
});

export const appPrisma =
  globalForAppPrisma.appPrisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForAppPrisma.appPrisma = appPrisma;
}
