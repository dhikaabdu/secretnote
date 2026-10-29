"use server";

import { redirect } from "next/navigation";
import {
  readDemoCredentials,
  verifyDemoCredentials,
} from "../../lib/auth/credentials";
import {
  revokeCurrentDemoSession,
  startDemoSession,
} from "../../lib/auth/session";

export type LoginActionState = {
  error: string;
};

export async function loginDemo(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const username = formData.get("username");
  const password = formData.get("password");
  const credentials = readDemoCredentials();

  if (!credentials) {
    return {
      error: "Login demo belum dikonfigurasi pada server.",
    };
  }

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !verifyDemoCredentials(username, password, credentials)
  ) {
    return {
      error: "Nama pengguna atau kata sandi tidak valid.",
    };
  }

  await startDemoSession();
  redirect("/notes");
}

export async function logoutDemo(): Promise<void> {
  await revokeCurrentDemoSession();
  redirect("/login");
}
