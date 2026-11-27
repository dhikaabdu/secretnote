import {
  Kategori as PrismaKategori,
  Prisma,
} from "../../generated/prisma/client.ts";
import { z } from "zod";
import {
  API_PRIVATE_HEADERS,
  problemResponse,
  validationProblem,
} from "./problem-details.ts";

const itemIdSchema = z.object({
  id: z
    .string()
    .regex(/^[1-9]\d*$/, "ID harus berupa bilangan bulat positif.")
    .transform(Number)
    .refine(
      (value) => Number.isSafeInteger(value) && value <= 2_147_483_647,
      "ID di luar rentang Int PostgreSQL.",
    ),
});

export const itemPatchSchema = z
  .object({
    judul: z.string().trim().min(1).optional(),
    kategori: z.enum(PrismaKategori).optional(),
    deskripsi: z.string().trim().min(1).optional(),
    tersedia: z.boolean().optional(),
    gambar: z.string().nullable().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Setidaknya satu field harus dikirim.",
  });

export type ItemPatchInput = z.infer<typeof itemPatchSchema>;

export type ItemApiRecord = {
  id: number;
  judul: string;
  kategori: (typeof PrismaKategori)[keyof typeof PrismaKategori];
  deskripsi: string;
  tersedia: boolean;
  gambar: string | null;
  dibuatPada: Date;
};

export type ItemReviewSummary = {
  id: number;
  nama: string;
  nilai: number;
  komentar: string;
  dibuatPada: Date;
};

export type ItemReviewRecord = ItemReviewSummary & {
  itemId: number;
};

export type ItemApiDetail = ItemApiRecord & {
  ulasan: ItemReviewSummary[];
};

export interface ItemApiRepository {
  findDetail(id: number): Promise<ItemApiDetail | null>;
  update(id: number, data: ItemPatchInput): Promise<ItemApiRecord>;
  delete(id: number): Promise<void>;
  findReviews(id: number): Promise<ItemReviewRecord[] | null>;
}

function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: API_PRIVATE_HEADERS,
  });
}

function parseItemId(request: Request, rawId: string): number | Response {
  const result = itemIdSchema.safeParse({ id: rawId });

  if (!result.success) {
    return validationProblem(
      request,
      400,
      "Bad Request",
      "Parameter path harus berupa ID bilangan bulat positif.",
      result.error.issues,
    );
  }

  return result.data.id;
}

function isResponse(value: unknown): value is Response {
  return value instanceof Response;
}

function isJsonRequest(request: Request): boolean {
  const contentType = request.headers.get("content-type");
  return contentType?.split(";", 1)[0]?.trim().toLowerCase() ===
    "application/json";
}

async function readJsonBody(
  request: Request,
): Promise<
  { success: true; data: unknown } | { success: false; response: Response }
> {
  if (!isJsonRequest(request)) {
    return {
      success: false,
      response: problemResponse(
        request,
        415,
        "Unsupported Media Type",
        "Content-Type harus application/json.",
      ),
    };
  }

  const text = await request.text();

  try {
    return { success: true, data: JSON.parse(text) as unknown };
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;

    return {
      success: false,
      response: problemResponse(
        request,
        400,
        "Bad Request",
        "Body harus berupa JSON yang valid.",
      ),
    };
  }
}

function prismaErrorCode(error: unknown): string | undefined {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code;
  }
  return undefined;
}

async function safely(
  request: Request,
  operation: string,
  handler: () => Promise<Response>,
): Promise<Response> {
  try {
    return await handler();
  } catch (error) {
    console.error(`API Item ${operation} gagal:`, error);
    return problemResponse(
      request,
      500,
      "Internal Server Error",
      "Terjadi kesalahan internal. Silakan coba kembali.",
    );
  }
}

export function createItemApiHandlers(repository: ItemApiRepository) {
  return {
    getDetail(request: Request, rawId: string): Promise<Response> {
      return safely(request, "GET detail", async () => {
        const id = parseItemId(request, rawId);
        if (isResponse(id)) return id;

        const item = await repository.findDetail(id);
        if (!item) {
          return problemResponse(
            request,
            404,
            "Not Found",
            "Item tidak ditemukan.",
          );
        }

        return jsonResponse({ data: item });
      });
    },

    patch(request: Request, rawId: string): Promise<Response> {
      return safely(request, "PATCH detail", async () => {
        const id = parseItemId(request, rawId);
        if (isResponse(id)) return id;

        const body = await readJsonBody(request);
        if (!body.success) return body.response;

        const result = itemPatchSchema.safeParse(body.data);
        if (!result.success) {
          return validationProblem(
            request,
            422,
            "Unprocessable Content",
            "Body tidak sesuai dengan skema Item.",
            result.error.issues,
          );
        }

        try {
          const item = await repository.update(id, result.data);
          return jsonResponse({ data: item });
        } catch (error) {
          const code = prismaErrorCode(error);
          if (code === "P2025") {
            return problemResponse(
              request,
              404,
              "Not Found",
              "Item tidak ditemukan.",
            );
          }
          if (code === "P2002" || code === "P2003") {
            return problemResponse(
              request,
              409,
              "Conflict",
              "Perubahan Item bertentangan dengan data yang sudah ada.",
            );
          }
          throw error;
        }
      });
    },

    delete(request: Request, rawId: string): Promise<Response> {
      return safely(request, "DELETE detail", async () => {
        const id = parseItemId(request, rawId);
        if (isResponse(id)) return id;

        try {
          await repository.delete(id);
          return new Response(null, {
            status: 204,
            headers: API_PRIVATE_HEADERS,
          });
        } catch (error) {
          const code = prismaErrorCode(error);
          if (code === "P2025") {
            return problemResponse(
              request,
              404,
              "Not Found",
              "Item tidak ditemukan.",
            );
          }
          if (code === "P2003") {
            return problemResponse(
              request,
              409,
              "Conflict",
              "Item tidak dapat dihapus selama masih memiliki ulasan.",
            );
          }
          throw error;
        }
      });
    },

    getReviews(request: Request, rawId: string): Promise<Response> {
      return safely(request, "GET ulasan", async () => {
        const id = parseItemId(request, rawId);
        if (isResponse(id)) return id;

        const reviews = await repository.findReviews(id);
        if (!reviews) {
          return problemResponse(
            request,
            404,
            "Not Found",
            "Item tidak ditemukan.",
          );
        }

        return jsonResponse({ data: reviews });
      });
    },
  };
}
