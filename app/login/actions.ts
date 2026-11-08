
"use server";

import { redirect } from "next/navigation";
import { appPrisma } from "@/lib/app-prisma";
import { verifyPassword } from "@/lib/auth/password";
import { startUserSession } from "@/lib/auth/user-session";

export type LoginActionState = {
  error: string;
};

export async function loginUser(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const username = formData.get("username");
  const password = formData.get("password");

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password
  ) {
    return {
      error: "Nama pengguna atau kata sandi tidak valid.",
    };
  }

  const user = await appPrisma.user.findUnique({
    where: {
      username: username.trim(),
    },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (
    !user ||
    !(await verifyPassword(user.passwordHash, password))
  ) {
    return {
      error: "Nama pengguna atau kata sandi tidak valid.",
    };
  }

  await startUserSession(user.id);

  redirect("/notes");
}

export async function logoutUser(): Promise<void> {
  const { revokeCurrentUserSession } = await import(
    "@/lib/auth/user-session"
  );

  await revokeCurrentUserSession();

  redirect("/login");
}
