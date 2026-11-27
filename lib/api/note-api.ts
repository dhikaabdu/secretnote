import { z } from "zod";
import { NOTE_CATEGORIES, noteSchema } from "../skema.ts";
import {
  API_PRIVATE_HEADERS,
  problemResponse,
  validationProblem,
} from "./problem-details.ts";

const noteIdSchema = z.string().cuid();

const createNoteBodySchema = z
  .object({
    title: noteSchema.shape.title,
    content: noteSchema.shape.content,
    category: z.enum(NOTE_CATEGORIES).nullable().optional(),
  })
  .strict();

const patchNoteBodySchema = createNoteBodySchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Setidaknya satu field harus dikirim.",
  });

const noteListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).max(10000).default(1),
    batas: z.coerce.number().int().min(1).max(50).default(20),
    category: z.enum(NOTE_CATEGORIES).optional(),
  })
  .strict();

export type NoteApiRecord = {
  id: string;
  title: string;
  content: string;
  category: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateNoteInput = z.infer<typeof createNoteBodySchema>;
export type PatchNoteInput = z.infer<typeof patchNoteBodySchema>;

export type NoteListOptions = {
  skip: number;
  take: number;
  category?: (typeof NOTE_CATEGORIES)[number];
};

export type NoteApiPage = {
  notes: NoteApiRecord[];
  total: number;
};

export interface NoteApiRepository {
  listForUser(
    userId: string,
    options: NoteListOptions,
  ): Promise<NoteApiPage>;
  createForUser(
    userId: string,
    data: CreateNoteInput,
  ): Promise<NoteApiRecord>;
  findOwned(id: string, userId: string): Promise<NoteApiRecord | null>;
  updateOwned(
    id: string,
    userId: string,
    data: PatchNoteInput,
  ): Promise<NoteApiRecord | null>;
  deleteOwned(id: string, userId: string): Promise<boolean>;
}

type NoteApiSession = {
  userId: string;
} | null | undefined;

type NoteApiDependencies = {
  repository: NoteApiRepository;
  readSession: () => Promise<NoteApiSession>;
};

function jsonResponse(
  body: unknown,
  status: number,
  headers: HeadersInit = {},
): Response {
  const responseHeaders = new Headers(API_PRIVATE_HEADERS);
  new Headers(headers).forEach((value, key) => {
    responseHeaders.set(key, value);
  });

  return Response.json(body, {
    status,
    headers: responseHeaders,
  });
}

function isJsonRequest(request: Request): boolean {
  const contentType = request.headers.get("content-type");
  return contentType?.split(";", 1)[0]?.trim().toLowerCase() ===
    "application/json";
}

async function readJsonBody(
  request: Request,
): Promise<{ success: true; data: unknown } | { success: false; response: Response }> {
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
    return {
      success: true,
      data: JSON.parse(text) as unknown,
    };
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }

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

function parseCuidParameter(
  request: Request,
  value: string,
  parameter: "id" | "userId",
): string | Response {
  const result = noteIdSchema.safeParse(value);

  if (!result.success) {
    return problemResponse(
      request,
      400,
      "Bad Request",
      "Parameter path harus berupa CUID yang valid.",
      [{ path: parameter, message: "Format CUID tidak valid." }],
    );
  }

  return result.data;
}

function parseListQuery(request: Request):
  | {
      page: number;
      batas: number;
      category?: (typeof NOTE_CATEGORIES)[number];
    }
  | Response {
  const url = new URL(request.url);
  const result = noteListQuerySchema.safeParse(
    Object.fromEntries(url.searchParams.entries()),
  );

  if (!result.success) {
    return validationProblem(
      request,
      400,
      "Bad Request",
      "Parameter query tidak valid.",
      result.error.issues,
    );
  }

  return result.data;
}

function isResponse(value: unknown): value is Response {
  return value instanceof Response;
}

function requireSession(
  request: Request,
  session: NoteApiSession,
): { userId: string } | Response {
  if (!session) {
    return problemResponse(
      request,
      401,
      "Unauthorized",
      "Autentikasi diperlukan untuk mengakses resource ini.",
    );
  }

  return { userId: session.userId };
}

async function safely(
  request: Request,
  operation: string,
  handler: () => Promise<Response>,
): Promise<Response> {
  try {
    return await handler();
  } catch (error) {
    console.error(`API Note ${operation} gagal:`, error);
    return problemResponse(
      request,
      500,
      "Internal Server Error",
      "Terjadi kesalahan internal. Silakan coba kembali.",
    );
  }
}

export function createNoteApiHandlers({
  repository,
  readSession,
}: NoteApiDependencies) {
  return {
    getCollection(request: Request): Promise<Response> {
      return safely(request, "GET collection", async () => {
        const sessionResult = requireSession(request, await readSession());
        if (isResponse(sessionResult)) return sessionResult;

        const query = parseListQuery(request);
        if (isResponse(query)) return query;

        const options: NoteListOptions = {
          skip: (query.page - 1) * query.batas,
          take: query.batas,
          ...(query.category ? { category: query.category } : {}),
        };
        const { notes, total } = await repository.listForUser(
          sessionResult.userId,
          options,
        );

        return jsonResponse({
          data: notes,
          pagination: {
            page: query.page,
            batas: query.batas,
            total,
            totalPages: Math.ceil(total / query.batas),
          },
        }, 200);
      });
    },

    create(request: Request): Promise<Response> {
      return safely(request, "POST collection", async () => {
        const sessionResult = requireSession(request, await readSession());
        if (isResponse(sessionResult)) return sessionResult;

        const body = await readJsonBody(request);
        if (!body.success) return body.response;

        const validation = createNoteBodySchema.safeParse(body.data);
        if (!validation.success) {
          return validationProblem(
            request,
            422,
            "Unprocessable Content",
            "Body tidak memenuhi aturan validasi.",
            validation.error.issues,
          );
        }

        const note = await repository.createForUser(
          sessionResult.userId,
          validation.data,
        );

        return jsonResponse(
          { data: note },
          201,
          { Location: `/api/v1/notes/${note.id}` },
        );
      });
    },

    getById(request: Request, id: string): Promise<Response> {
      return safely(request, "GET detail", async () => {
        const sessionResult = requireSession(request, await readSession());
        if (isResponse(sessionResult)) return sessionResult;

        const parsedId = parseCuidParameter(request, id, "id");
        if (isResponse(parsedId)) return parsedId;

        const note = await repository.findOwned(
          parsedId,
          sessionResult.userId,
        );
        if (!note) {
          return problemResponse(
            request,
            404,
            "Not Found",
            "Catatan tidak ditemukan.",
          );
        }

        return jsonResponse({ data: note }, 200);
      });
    },

    patch(request: Request, id: string): Promise<Response> {
      return safely(request, "PATCH detail", async () => {
        const sessionResult = requireSession(request, await readSession());
        if (isResponse(sessionResult)) return sessionResult;

        const parsedId = parseCuidParameter(request, id, "id");
        if (isResponse(parsedId)) return parsedId;

        const body = await readJsonBody(request);
        if (!body.success) return body.response;

        const validation = patchNoteBodySchema.safeParse(body.data);
        if (!validation.success) {
          return validationProblem(
            request,
            422,
            "Unprocessable Content",
            "Body tidak memenuhi aturan validasi.",
            validation.error.issues,
          );
        }

        const note = await repository.updateOwned(
          parsedId,
          sessionResult.userId,
          validation.data,
        );
        if (!note) {
          return problemResponse(
            request,
            404,
            "Not Found",
            "Catatan tidak ditemukan.",
          );
        }

        return jsonResponse({ data: note }, 200);
      });
    },

    delete(request: Request, id: string): Promise<Response> {
      return safely(request, "DELETE detail", async () => {
        const sessionResult = requireSession(request, await readSession());
        if (isResponse(sessionResult)) return sessionResult;

        const parsedId = parseCuidParameter(request, id, "id");
        if (isResponse(parsedId)) return parsedId;

        const deleted = await repository.deleteOwned(
          parsedId,
          sessionResult.userId,
        );
        if (!deleted) {
          return problemResponse(
            request,
            404,
            "Not Found",
            "Catatan tidak ditemukan.",
          );
        }

        return new Response(null, {
          status: 204,
          headers: API_PRIVATE_HEADERS,
        });
      });
    },

    getUserNotes(request: Request, userId: string): Promise<Response> {
      return safely(request, "GET user relation", async () => {
        const sessionResult = requireSession(request, await readSession());
        if (isResponse(sessionResult)) return sessionResult;

        const parsedUserId = parseCuidParameter(request, userId, "userId");
        if (isResponse(parsedUserId)) return parsedUserId;

        if (parsedUserId !== sessionResult.userId) {
          return problemResponse(
            request,
            404,
            "Not Found",
            "Resource tidak ditemukan.",
          );
        }

        const query = parseListQuery(request);
        if (isResponse(query)) return query;

        const options: NoteListOptions = {
          skip: (query.page - 1) * query.batas,
          take: query.batas,
          ...(query.category ? { category: query.category } : {}),
        };
        const { notes, total } = await repository.listForUser(
          parsedUserId,
          options,
        );

        return jsonResponse({
          data: notes,
          pagination: {
            page: query.page,
            batas: query.batas,
            total,
            totalPages: Math.ceil(total / query.batas),
          },
        }, 200);
      });
    },
  };
}
