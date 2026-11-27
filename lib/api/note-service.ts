import "server-only";

import { appPrisma } from "@/lib/app-prisma";
import { readCurrentUserSession } from "@/lib/auth/user-session";
import {
  createNoteApiHandlers,
  type NoteApiRecord,
} from "./note-api";

const noteSelect = {
  id: true,
  title: true,
  content: true,
  category: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const noteApi = createNoteApiHandlers({
  repository: {
    listForUser(userId, options) {
      return appPrisma.$transaction(async (transaction) => {
        const where = {
          userId,
          ...(options.category ? { category: options.category } : {}),
        };
        const [notes, total] = await Promise.all([
          transaction.note.findMany({
            where,
            select: noteSelect,
            orderBy: { updatedAt: "desc" },
            skip: options.skip,
            take: options.take,
          }),
          transaction.note.count({ where }),
        ]);

        return { notes, total };
      });
    },

    createForUser(userId, data) {
      return appPrisma.note.create({
        data: {
          ...data,
          userId,
        },
        select: noteSelect,
      });
    },

    findOwned(id, userId) {
      return appPrisma.note.findFirst({
        where: { id, userId },
        select: noteSelect,
      });
    },

    async updateOwned(id, userId, data): Promise<NoteApiRecord | null> {
      return appPrisma.$transaction(async (transaction) => {
        const result = await transaction.note.updateMany({
          where: { id, userId },
          data,
        });

        if (result.count === 0) {
          return null;
        }

        return transaction.note.findFirst({
          where: { id, userId },
          select: noteSelect,
        });
      });
    },

    async deleteOwned(id, userId) {
      const result = await appPrisma.note.deleteMany({
        where: { id, userId },
      });
      return result.count > 0;
    },
  },
  async readSession() {
    const session = await readCurrentUserSession();
    return session ? { userId: session.userId } : undefined;
  },
});
