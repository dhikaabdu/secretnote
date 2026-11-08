
"use server";

import { redirect } from "next/navigation";
import { registerSchema } from "@/lib/skema";
import { appPrisma } from "@/lib/app-prisma";
import { hashPassword } from "@/lib/auth/password";

export type RegisterActionState = {
  error: string;
};

export async function registerUser(
  _previousState: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const validation = registerSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validation.success) {
    return {
      error: validation.error.issues[0]?.message ?? "Data registrasi tidak valid.",
    };
  }

  const { username, email, password } = validation.data;
  const normalizedEmail = email.toLowerCase();

  try {
    const existingUser = await appPrisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: normalizedEmail },
        ],
      },
      select: { id: true },
    });

    if (existingUser) {
      return {
        error: "Username atau email sudah terdaftar.",
      };
    }

    const passwordHash = await hashPassword(password);

    await appPrisma.user.create({
      data: {
        username,
        email: normalizedEmail,
        passwordHash,
        role: "USER",
      },
    });
  } catch {
    return {
      error: "Registrasi gagal. Silakan coba kembali.",
    };
  }

  redirect("/login?registered=1");
}
