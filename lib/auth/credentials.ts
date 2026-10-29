import "server-only";

import { timingSafeEqual } from "node:crypto";

export type DemoCredentials = {
  username: string;
  password: string;
};

export function readDemoCredentials(): DemoCredentials | null {
  const username = process.env.DEMO_USERNAME;
  const password = process.env.DEMO_PASSWORD;

  if (!username?.trim() || !password?.trim()) {
    return null;
  }

  return { username, password };
}

function constantTimeEqual(candidate: string, expected: string): boolean {
  const candidateBuffer = Buffer.from(candidate, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  return (
    candidateBuffer.length === expectedBuffer.length &&
    timingSafeEqual(candidateBuffer, expectedBuffer)
  );
}

export function verifyDemoCredentials(
  username: string,
  password: string,
  expected: DemoCredentials | null = readDemoCredentials(),
): boolean {
  if (!expected) {
    return false;
  }

  const validUsername = constantTimeEqual(username, expected.username);
  const validPassword = constantTimeEqual(password, expected.password);

  return validUsername && validPassword;
}
