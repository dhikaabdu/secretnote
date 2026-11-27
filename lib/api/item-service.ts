import { prisma } from "@/lib/prisma";
import { ambilItem, hapusItem, ubahItem } from "@/lib/praktikum-data";
import { createItemApiHandlers } from "./item-api";

export const itemApi = createItemApiHandlers({
  findDetail: ambilItem,
  update: ubahItem,
  async delete(id) {
    await hapusItem(id);
  },
  async findReviews(id) {
    const item = await prisma.item.findUnique({
      where: { id },
      select: {
        ulasan: {
          select: {
            id: true,
            nama: true,
            nilai: true,
            komentar: true,
            dibuatPada: true,
            itemId: true,
          },
          orderBy: { dibuatPada: "desc" },
        },
      },
    });

    return item?.ulasan ?? null;
  },
});
