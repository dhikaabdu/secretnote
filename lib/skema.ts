import { z } from "zod";

export const NOTE_CATEGORIES = [
  "Personal",
  "Akademik",
  "Produktivitas",
  "Lainnya",
] as const;

export const noteSchema = z.object({
  title: z
    .string({ error: "Judul catatan wajib diisi." })
    .refine((value) => value.trim().length > 0, {
      message: "Judul catatan wajib diisi.",
    }),
  category: z.enum(NOTE_CATEGORIES, {
    error: "Pilih kategori yang tersedia.",
  }),
  content: z
    .string({ error: "Isi catatan wajib diisi." })
    .refine((value) => value.trim().length > 0, {
      message: "Isi catatan wajib diisi.",
    }),
});

export type NoteCategory = (typeof NOTE_CATEGORIES)[number];
export type NoteField = keyof typeof noteSchema.shape;

export type NoteFormState = {
  status: "idle" | "error" | "validated";
  message: string;
  errors: Partial<Record<NoteField, string>>;
  values: {
    title: string;
    category: string;
    content: string;
  };
};

export const initialNoteFormState: NoteFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: {
    title: "",
    category: "Personal",
    content: "",
  },
};
