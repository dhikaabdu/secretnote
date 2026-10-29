import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "./constants";
import {
  createDemoSession,
  findDemoSession,
  revokeDemoSession,
  type DemoSession,
} from "./session-store";

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function readCurrentDemoSession(): Promise<
  DemoSession | undefined
> {
  await connection();
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  return token ? findDemoSession(token) : undefined;
}

export async function requireDemoSession(): Promise<DemoSession> {
  const session = await readCurrentDemoSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function startDemoSession(): Promise<void> {
  const { token } = createDemoSession();
  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE_NAME,
    token,
    cookieOptions(SESSION_MAX_AGE_SECONDS),
  );
}

export async function revokeCurrentDemoSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    revokeDemoSession(token);
  }

  cookieStore.set(SESSION_COOKIE_NAME, "", cookieOptions(0));
}
