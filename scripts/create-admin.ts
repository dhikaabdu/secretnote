
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/app-prisma/client";
import argon2 from "argon2";
import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";

const adapter = new PrismaPg({
  connectionString: process.env.APP_DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

function ask(question: string): Promise<string> {
  const rl = createInterface({ input: stdin, output: stdout });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function askHidden(question: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
      reject(new Error("Terminal interaktif diperlukan untuk input password."));
      return;
    }

    stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();

    let password = "";

    const onData = (key: Buffer) => {
      const char = key.toString("utf8");

      if (char === "\u0003") {
        cleanup();
        reject(new Error("Proses dibatalkan."));
        return;
      }

      if (char === "\r" || char === "\n") {
        cleanup();
        stdout.write("\n");
        resolve(password);
        return;
      }

      if (char === "\u007f" || char === "\b") {
        password = password.slice(0, -1);
        return;
      }

      if (char >= " " && char !== "\u007f") {
        password += char;
      }
    };

    const cleanup = () => {
      stdin.removeListener("data", onData);
      stdin.setRawMode(false);
      stdin.pause();
    };

    stdin.on("data", onData);
  });
}

async function main() {
  const username = await ask("Username ADMIN: ");
  const email = (await ask("Email ADMIN: ")).toLowerCase();
  const password = await askHidden("Password ADMIN (min. 12 karakter): ");

  if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
    throw new Error("Username harus 3-30 karakter: huruf, angka, atau underscore.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Format email tidak valid.");
  }

  if (password.length < 12 || password.length > 128) {
    throw new Error("Password harus terdiri dari 12-128 karakter.");
  }

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
    select: { id: true },
  });

  if (existingUser) {
    throw new Error("Username atau email sudah digunakan. Tidak ada perubahan akun.");
  }

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  const admin = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
      role: "ADMIN",
    },
    select: {
      username: true,
      email: true,
      role: true,
    },
  });

  console.log("\nAkun berhasil dibuat:");
  console.log(admin);
}

main()
  .catch((error) => {
    console.error("\nGagal membuat akun ADMIN:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
