import assert from "node:assert/strict";
import test from "node:test";
import { Kategori, Prisma } from "../generated/prisma/client.ts";
import {
  createItemApiHandlers,
  type ItemApiDetail,
  type ItemApiRecord,
  type ItemApiRepository,
  type ItemReviewRecord,
} from "../lib/api/item-api.ts";

const now = new Date("2025-01-01T00:00:00.000Z");
const initialItem: ItemApiRecord = {
  id: 7,
  judul: "Bank Sampah",
  kategori: Kategori.lingkungan,
  deskripsi: "Program pemilahan sampah.",
  tersedia: true,
  gambar: null,
  dibuatPada: now,
};
const review: ItemReviewRecord = {
  id: 19,
  nama: "Pengunjung",
  nilai: 5,
  komentar: "Bermanfaat.",
  dibuatPada: now,
  itemId: initialItem.id,
};

function knownPrismaError(code: string) {
  return new Prisma.PrismaClientKnownRequestError("test error", {
    code,
    clientVersion: "test",
  });
}

function createHarness(options: {
  updateError?: Error;
  deleteError?: Error;
  includeReviews?: boolean;
} = {}) {
  let item: ItemApiRecord | null = { ...initialItem };
  const reviews: ItemReviewRecord[] = options.includeReviews === false
    ? []
    : [{ ...review }];

  const repository: ItemApiRepository = {
    async findDetail(id): Promise<ItemApiDetail | null> {
      if (!item || item.id !== id) return null;
      return {
        ...item,
        ulasan: reviews.map(({ id, nama, nilai, komentar, dibuatPada }) => ({
          id,
          nama,
          nilai,
          komentar,
          dibuatPada,
        })),
      };
    },
    async update(id, data) {
      if (options.updateError) throw options.updateError;
      if (!item || item.id !== id) throw knownPrismaError("P2025");
      item = { ...item, ...data };
      return item;
    },
    async delete(id) {
      if (options.deleteError) throw options.deleteError;
      if (!item || item.id !== id) throw knownPrismaError("P2025");
      if (reviews.length > 0) throw knownPrismaError("P2003");
      item = null;
    },
    async findReviews(id) {
      return item?.id === id ? reviews : null;
    },
  };

  return {
    api: createItemApiHandlers(repository),
    getItem: () => item,
  };
}

function jsonRequest(path: string, method: string, body: string): Request {
  return new Request(`http://localhost${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body,
  });
}

test("GET detail returns the Item and its review summaries", async () => {
  const { api } = createHarness();
  const response = await api.getDetail(
    new Request("http://localhost/api/v1/item/7"),
    "7",
  );

  assert.equal(response.status, 200);
  assert.equal((await response.json()).data.id, 7);
});

test("invalid and missing Item IDs return 400 and 404", async () => {
  const { api } = createHarness();
  const invalid = await api.getDetail(
    new Request("http://localhost/api/v1/item/0"),
    "0",
  );
  const outOfRange = await api.getDetail(
    new Request("http://localhost/api/v1/item/2147483648"),
    "2147483648",
  );
  const missing = await api.getDetail(
    new Request("http://localhost/api/v1/item/8"),
    "8",
  );

  assert.equal(invalid.status, 400);
  assert.equal(outOfRange.status, 400);
  assert.equal(
    invalid.headers.get("content-type"),
    "application/problem+json",
  );
  assert.equal(missing.status, 404);
});

test("PATCH rejects invalid media types, malformed JSON, and empty objects", async () => {
  const { api } = createHarness();
  const unsupported = await api.patch(
    new Request("http://localhost/api/v1/item/7", { method: "PATCH" }),
    "7",
  );
  const malformed = await api.patch(
    jsonRequest("/api/v1/item/7", "PATCH", "{"),
    "7",
  );
  const empty = await api.patch(
    jsonRequest("/api/v1/item/7", "PATCH", "{}"),
    "7",
  );

  assert.equal(unsupported.status, 415);
  assert.equal(malformed.status, 400);
  assert.equal(empty.status, 422);
});

test("PATCH applies a valid partial update", async () => {
  const { api, getItem } = createHarness();
  const response = await api.patch(
    jsonRequest("/api/v1/item/7", "PATCH", '{"tersedia":false}'),
    "7",
  );

  assert.equal(response.status, 200);
  assert.equal(getItem()?.tersedia, false);
  assert.equal((await response.json()).data.tersedia, false);
});

test("PATCH maps Prisma P2025 to 404", async () => {
  const { api } = createHarness({
    updateError: knownPrismaError("P2025"),
  });
  const response = await api.patch(
    jsonRequest("/api/v1/item/7", "PATCH", '{"tersedia":false}'),
    "7",
  );

  assert.equal(response.status, 404);
});

test("DELETE maps missing records to 404 and relation conflicts to 409", async () => {
  const missing = createHarness({
    deleteError: knownPrismaError("P2025"),
  });
  const conflict = createHarness({
    deleteError: knownPrismaError("P2003"),
  });
  const missingResponse = await missing.api.delete(
    new Request("http://localhost/api/v1/item/7", { method: "DELETE" }),
    "7",
  );
  const conflictResponse = await conflict.api.delete(
    new Request("http://localhost/api/v1/item/7", { method: "DELETE" }),
    "7",
  );

  assert.equal(missingResponse.status, 404);
  assert.equal(conflictResponse.status, 409);
  assert.equal(
    conflictResponse.headers.get("content-type"),
    "application/problem+json",
  );
});

test("DELETE succeeds with 204 and no response body", async () => {
  const { api } = createHarness({ includeReviews: false });
  const response = await api.delete(
    new Request("http://localhost/api/v1/item/7", { method: "DELETE" }),
    "7",
  );

  assert.equal(response.status, 204);
  assert.equal(await response.text(), "");
});

test("GET related reviews returns 404 for a missing Item and a list for an existing Item", async () => {
  const { api } = createHarness();
  const found = await api.getReviews(
    new Request("http://localhost/api/v1/item/7/ulasan"),
    "7",
  );
  const missing = await api.getReviews(
    new Request("http://localhost/api/v1/item/8/ulasan"),
    "8",
  );

  assert.equal(found.status, 200);
  assert.equal((await found.json()).data[0].itemId, 7);
  assert.equal(missing.status, 404);
});
