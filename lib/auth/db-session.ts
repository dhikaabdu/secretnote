
import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { appPrisma } from "@/lib/app-prisma";
import { SESSION_MAX_AGE_SECONDS } from "./constants";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createUserSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(
    Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  );

  await appPrisma.session.create({
    data: {
      tokenHash: hashToken(token),
      userId,
      expiresAt,
    },
  });

  return {
    token,
    expiresAt,
  };
}

export async function findUserSession(token: string) {
  const tokenHash = hashToken(token);

  const session = await appPrisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!session) {
    return undefined;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await appPrisma.session.delete({
      where: { id: session.id },
    });

    return undefined;
  }

  return {
    id: session.id,
    userId: session.userId,
    username: session.user.username,
    email: session.user.email,
    role: session.user.role,
    expiresAt: session.expiresAt,
  };
}

export async function revokeUserSession(token: string): Promise<boolean> {
  const result = await appPrisma.session.deleteMany({
    where: {
      tokenHash: hashToken(token),
    },
  });

  return result.count > 0;
}
