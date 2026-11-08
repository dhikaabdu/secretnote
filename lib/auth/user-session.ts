
import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "./constants";
import {
  createUserSession,
  findUserSession,
  revokeUserSession,
} from "./db-session";

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function readCurrentUserSession() {
  await connection();

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  return token ? findUserSession(token) : undefined;
}

export async function requireUserSession() {
  const session = await readCurrentUserSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireRole(
  allowedRoles: Array<"ADMIN" | "USER">,
) {
  const session = await requireUserSession();

  if (!allowedRoles.includes(session.role)) {
    redirect("/notes");
  }

  return session;
}

export async function startUserSession(userId: string): Promise<void> {
  const { token } = await createUserSession(userId);
  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE_NAME,
    token,
    cookieOptions(SESSION_MAX_AGE_SECONDS),
  );
}

export async function revokeCurrentUserSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await revokeUserSession(token);
  }

  cookieStore.set(SESSION_COOKIE_NAME, "", cookieOptions(0));
}
