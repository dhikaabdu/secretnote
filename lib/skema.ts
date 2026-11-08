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
    .trim()
    .min(1, "Judul catatan wajib diisi.")
    .max(100, "Judul catatan maksimal 100 karakter."),

  category: z.enum(NOTE_CATEGORIES, {
    error: "Pilih kategori yang tersedia.",
  }),

  content: z
    .string({ error: "Isi catatan wajib diisi." })
    .trim()
    .min(1, "Isi catatan wajib diisi.")
    .max(20000, "Isi catatan maksimal 20.000 karakter."),
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


export const registerSchema = z
  .object({
    username: z
      .string({ error: "Username wajib diisi." })
      .trim()
      .min(3, "Username minimal 3 karakter.")
      .max(30, "Username maksimal 30 karakter.")
      .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh berisi huruf, angka, dan underscore."),

    email: z
      .string({ error: "Email wajib diisi." })
      .trim()
      .email("Format email tidak valid.")
      .max(254, "Email maksimal 254 karakter."),

    password: z
      .string({ error: "Password wajib diisi." })
      .min(12, "Password minimal 12 karakter.")
      .max(128, "Password maksimal 128 karakter."),

    confirmPassword: z
      .string({ error: "Konfirmasi password wajib diisi." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak sama.",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
