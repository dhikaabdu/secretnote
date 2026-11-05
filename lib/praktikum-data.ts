import "server-only";
import { prisma } from "@/lib/prisma";
import type { Kategori } from "@/generated/prisma/client";

export async function ambilDaftarItem() {
  return prisma.item.findMany({
    select: {
      id: true,
      judul: true,
      kategori: true,
      deskripsi: true,
      tersedia: true,
      gambar: true,
      ulasan: {
        select: {
          id: true,
          nama: true,
          nilai: true,
          komentar: true,
          dibuatPada: true,
        },
        orderBy: {
          dibuatPada: "desc",
        },
      },
    },
    orderBy: {
      dibuatPada: "desc",
    },
  });
}

export async function ambilItem(id: number) {
  return prisma.item.findUnique({
    where: { id },
    select: {
      id: true,
      judul: true,
      kategori: true,
      deskripsi: true,
      tersedia: true,
      gambar: true,
      ulasan: {
        select: {
          id: true,
          nama: true,
          nilai: true,
          komentar: true,
          dibuatPada: true,
        },
        orderBy: {
          dibuatPada: "desc",
        },
      },
    },
  });
}

export async function tambahItem(data: {
  judul: string;
  kategori: Kategori;
  deskripsi: string;
  tersedia?: boolean;
  gambar?: string | null;
}) {
  return prisma.item.create({
    data: {
      judul: data.judul,
      kategori: data.kategori,
      deskripsi: data.deskripsi,
      tersedia: data.tersedia ?? true,
      gambar: data.gambar ?? null,
    },
  });
}

export async function ubahItem(
  id: number,
  data: {
    judul?: string;
    kategori?: Kategori;
    deskripsi?: string;
    tersedia?: boolean;
    gambar?: string | null;
  },
) {
  return prisma.item.update({
    where: { id },
    data,
  });
}

export async function hapusItem(id: number) {
  return prisma.item.delete({
    where: { id },
  });
}