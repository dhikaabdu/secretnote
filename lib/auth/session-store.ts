import "server-only";

import { randomBytes } from "node:crypto";
import { SESSION_MAX_AGE_SECONDS } from "./constants.ts";

export type DemoSession = {
  userId: "demo-user";
  expiresAt: number;
};

type StoredSession = DemoSession;

const sessions = new Map<string, StoredSession>();

export function createDemoSession(
  now = Date.now(),
): { token: string; session: DemoSession } {
  const token = randomBytes(32).toString("base64url");
  const session: DemoSession = {
    userId: "demo-user",
    expiresAt: now + SESSION_MAX_AGE_SECONDS * 1000,
  };

  sessions.set(token, session);
  return { token, session };
}

export function findDemoSession(
  token: string,
  now = Date.now(),
): DemoSession | undefined {
  const session = sessions.get(token);

  if (!session) {
    return undefined;
  }

  if (session.expiresAt <= now) {
    sessions.delete(token);
    return undefined;
  }

  return session;
}

export function revokeDemoSession(token: string): boolean {
  return sessions.delete(token);
}
