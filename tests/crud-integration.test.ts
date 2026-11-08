
import "dotenv/config";
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/app-prisma/client.ts";

const adapter = new PrismaPg({
  connectionString: process.env.APP_DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

test("10 skenario CRUD dan relasi PostgreSQL", async (t) => {
  const unique = randomUUID();
  const username = `test_${unique.slice(0, 12)}`;
  const email = `${unique}@example.test`;

  let userId: string | undefined;
  let noteId: string | undefined;

  try {
    await t.test("1. Create User", async () => {
      const user = await prisma.user.create({
        data: {
          username,
          email,
          passwordHash: "synthetic-test-hash",
          role: "USER",
        },
      });

      userId = user.id;
      assert.ok(user.id);
      assert.equal(user.username, username);
    });

    await t.test("2. Read User", async () => {
      const user = await prisma.user.findUnique({
        where: { id: userId! },
      });

      assert.ok(user);
      assert.equal(user.email, email);
    });

    await t.test("3. Update User", async () => {
      const updated = await prisma.user.update({
        where: { id: userId! },
        data: { username: `${username}_updated` },
      });

      assert.equal(updated.username, `${username}_updated`);
    });

    await t.test("4. Create Note", async () => {
      const note = await prisma.note.create({
        data: {
          title: "Integration Test Note",
          content: "Synthetic content for CRUD testing.",
          category: "Akademik",
          userId: userId!,
        },
      });

      noteId = note.id;
      assert.ok(note.id);
      assert.equal(note.userId, userId);
    });

    await t.test("5. Read Note", async () => {
      const note = await prisma.note.findFirst({
        where: { id: noteId!, userId: userId! },
      });

      assert.ok(note);
      assert.equal(note.title, "Integration Test Note");
    });

    await t.test("6. Update Note", async () => {
      const updated = await prisma.note.update({
        where: { id: noteId! },
        data: { title: "Updated Integration Test Note" },
      });

      assert.equal(updated.title, "Updated Integration Test Note");
    });

    await t.test("7. Relasi User–Note", async () => {
      const user = await prisma.user.findUnique({
        where: { id: userId! },
        include: { notes: true },
      });

      assert.ok(user);
      assert.equal(user.notes.length, 1);
      assert.equal(user.notes[0].id, noteId);
    });

    await t.test("8. Relasi User–Session", async () => {
      const session = await prisma.session.create({
        data: {
          tokenHash: `test_${unique}`,
          userId: userId!,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      });

      const user = await prisma.user.findUnique({
        where: { id: userId! },
        include: { sessions: true },
      });

      assert.ok(user);
      assert.ok(user.sessions.some((item) => item.id === session.id));
    });

    await t.test("9. Delete Note", async () => {
      await prisma.note.delete({
        where: { id: noteId! },
      });

      const note = await prisma.note.findUnique({
        where: { id: noteId! },
      });

      assert.equal(note, null);
      noteId = undefined;
    });

    await t.test("10. Delete User", async () => {
      await prisma.user.delete({
        where: { id: userId! },
      });

      const user = await prisma.user.findUnique({
        where: { id: userId! },
      });

      assert.equal(user, null);
      userId = undefined;
    });
  } finally {
    if (userId) {
      await prisma.user.deleteMany({
        where: { id: userId },
      });
    }

    if (noteId) {
      await prisma.note.deleteMany({
        where: { id: noteId },
      });
    }

    await prisma.$disconnect();
  }
});
