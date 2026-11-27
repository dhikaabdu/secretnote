import test from "node:test";
import assert from "node:assert/strict";
import {
  createNoteApiHandlers,
  type NoteApiRecord,
  type NoteApiRepository,
  type NoteListOptions,
} from "../lib/api/note-api.ts";

const ownerId = "c123456789012345678901234";
const otherUserId = "c123456789012345678901235";
const noteId = "c123456789012345678901236";

function createHarness() {
  const records = new Map<string, NoteApiRecord>();
  let session: { userId: string } | undefined = { userId: ownerId };

  const repository: NoteApiRepository = {
    async listForUser(userId: string, options: NoteListOptions) {
      const filtered = [...records.values()]
        .filter((record) => {
          const owner = owners.get(record.id);
          return owner === userId &&
            (!options.category || record.category === options.category);
        });

      return {
        notes: filtered
          .sort((left, right) => right.updatedAt.getTime() - left.updatedAt.getTime())
          .slice(options.skip, options.skip + options.take),
        total: filtered.length,
      };
    },
    async createForUser(userId, data) {
      const now = new Date();
      const record: NoteApiRecord = {
        id: noteId,
        title: data.title,
        content: data.content,
        category: data.category ?? null,
        createdAt: now,
        updatedAt: now,
      };
      records.set(record.id, record);
      owners.set(record.id, userId);
      return record;
    },
    async findOwned(id, userId) {
      return owners.get(id) === userId ? records.get(id) ?? null : null;
    },
    async updateOwned(id, userId, data) {
      const current = records.get(id);
      if (!current || owners.get(id) !== userId) return null;

      const updated = { ...current, ...data, updatedAt: new Date() };
      records.set(id, updated);
      return updated;
    },
    async deleteOwned(id, userId) {
      if (owners.get(id) !== userId) return false;
      owners.delete(id);
      return records.delete(id);
    },
  };

  const owners = new Map<string, string>();
  const api = createNoteApiHandlers({
    repository,
    async readSession() {
      return session;
    },
  });

  return {
    api,
    records,
    owners,
    setSession(value: { userId: string } | undefined) {
      session = value;
    },
  };
}

function makeRequest(
  path: string,
  options: {
    method?: string;
    body?: string;
    contentType?: string;
  } = {},
): Request {
  const headers = new Headers();
  if (options.contentType) {
    headers.set("Content-Type", options.contentType);
  }

  return new Request(`http://localhost${path}`, {
    method: options.method ?? "GET",
    headers,
    ...(options.body === undefined ? {} : { body: options.body }),
  });
}

function validNoteBody() {
  return JSON.stringify({
    title: "Catatan uji",
    content: "Isi sintetis untuk pengujian.",
    category: "Akademik",
  });
}

function addOwnedNote(
  harness: ReturnType<typeof createHarness>,
  id: string,
  userId: string,
) {
  const now = new Date();
  harness.records.set(id, {
    id,
    title: "Catatan uji",
    content: "Isi sintetis.",
    category: "Akademik",
    createdAt: now,
    updatedAt: now,
  });
  harness.owners.set(id, userId);
}

test("API menolak permintaan tanpa sesi dengan Problem Details", async () => {
  const harness = createHarness();
  harness.setSession(undefined);

  const response = await harness.api.getCollection(
    makeRequest("/api/v1/notes"),
  );
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.equal(response.headers.get("content-type"), "application/problem+json");
  assert.equal(body.status, 401);
});

test("GET koleksi mengembalikan catatan dan pagination", async () => {
  const harness = createHarness();
  addOwnedNote(harness, noteId, ownerId);

  const response = await harness.api.getCollection(
    makeRequest("/api/v1/notes?batas=1"),
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.data.length, 1);
  assert.equal(body.pagination.total, 1);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
});

test("GET koleksi menolak query yang tidak valid", async () => {
  const harness = createHarness();

  const response = await harness.api.getCollection(
    makeRequest("/api/v1/notes?page=0"),
  );

  assert.equal(response.status, 400);
  assert.equal(response.headers.get("content-type"), "application/problem+json");
});

test("GET koleksi membatasi limit hingga 50", async () => {
  const harness = createHarness();
  const tooMany = await harness.api.getCollection(
    makeRequest("/api/v1/notes?batas=51"),
  );
  const maximum = await harness.api.getCollection(
    makeRequest("/api/v1/notes?batas=50"),
  );
  const body = await maximum.json();

  assert.equal(tooMany.status, 400);
  assert.equal(maximum.status, 200);
  assert.equal(body.pagination.batas, 50);
});

test("GET koleksi memfilter kategori sesuai kategori Note", async () => {
  const harness = createHarness();
  addOwnedNote(harness, noteId, ownerId);
  const personalNoteId = "c123456789012345678901237";
  addOwnedNote(harness, personalNoteId, ownerId);
  const personalNote = harness.records.get(personalNoteId);
  assert.ok(personalNote);
  harness.records.set(personalNoteId, {
    ...personalNote,
    category: "Personal",
  });

  const response = await harness.api.getCollection(
    makeRequest("/api/v1/notes?category=Akademik"),
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.data.length, 1);
  assert.equal(body.data[0].category, "Akademik");
});

test("POST membuat catatan dengan pemilik dari sesi", async () => {
  const harness = createHarness();

  const response = await harness.api.create(
    makeRequest("/api/v1/notes", {
      method: "POST",
      contentType: "application/json",
      body: validNoteBody(),
    }),
  );
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(body.data.id, noteId);
  assert.equal(harness.owners.get(noteId), ownerId);
  assert.equal(response.headers.get("location"), `/api/v1/notes/${noteId}`);
});

test("POST menolak body yang tidak lolos validasi", async () => {
  const harness = createHarness();

  const response = await harness.api.create(
    makeRequest("/api/v1/notes", {
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify({ title: " ", content: "isi", category: "Rahasia" }),
    }),
  );
  const body = await response.json();

  assert.equal(response.status, 422);
  assert.equal(response.headers.get("content-type"), "application/problem+json");
  assert.equal(body.title, "Unprocessable Content");
  assert.ok(body.errors.length > 0);
});

test("POST mengembalikan Problem Details untuk JSON yang rusak", async () => {
  const harness = createHarness();

  const response = await harness.api.create(
    makeRequest("/api/v1/notes", {
      method: "POST",
      contentType: "application/json",
      body: "{",
    }),
  );

  assert.equal(response.status, 400);
  assert.equal(response.headers.get("content-type"), "application/problem+json");
});

test("POST menolak media type selain application/json", async () => {
  const harness = createHarness();

  const response = await harness.api.create(
    makeRequest("/api/v1/notes", {
      method: "POST",
      contentType: "text/plain",
      body: validNoteBody(),
    }),
  );

  assert.equal(response.status, 415);
});

test("GET detail hanya mengembalikan catatan milik sesi", async () => {
  const harness = createHarness();
  addOwnedNote(harness, noteId, ownerId);

  const response = await harness.api.getById(
    makeRequest(`/api/v1/notes/${noteId}`),
    noteId,
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.data.id, noteId);
  assert.equal("userId" in body.data, false);
});

test("GET detail menolak ID yang bukan CUID", async () => {
  const harness = createHarness();
  const response = await harness.api.getById(
    makeRequest("/api/v1/notes/not-a-cuid"),
    "not-a-cuid",
  );

  assert.equal(response.status, 400);
  assert.equal(response.headers.get("content-type"), "application/problem+json");
});

test("GET detail menyamarkan catatan pengguna lain sebagai tidak ditemukan", async () => {
  const harness = createHarness();
  addOwnedNote(harness, noteId, otherUserId);

  const response = await harness.api.getById(
    makeRequest(`/api/v1/notes/${noteId}`),
    noteId,
  );

  assert.equal(response.status, 404);
});

test("PATCH memperbarui sebagian field tanpa mengubah field lain", async () => {
  const harness = createHarness();
  addOwnedNote(harness, noteId, ownerId);

  const response = await harness.api.patch(
    makeRequest(`/api/v1/notes/${noteId}`, {
      method: "PATCH",
      contentType: "application/json",
      body: JSON.stringify({ title: "Judul diperbarui" }),
    }),
    noteId,
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.data.title, "Judul diperbarui");
  assert.equal(body.data.content, "Isi sintetis.");
});

test("PATCH menolak object kosong", async () => {
  const harness = createHarness();

  const response = await harness.api.patch(
    makeRequest(`/api/v1/notes/${noteId}`, {
      method: "PATCH",
      contentType: "application/json",
      body: "{}",
    }),
    noteId,
  );

  assert.equal(response.status, 422);
});

test("DELETE menghapus catatan milik sesi dan mengembalikan 204", async () => {
  const harness = createHarness();
  addOwnedNote(harness, noteId, ownerId);

  const response = await harness.api.delete(
    makeRequest(`/api/v1/notes/${noteId}`, { method: "DELETE" }),
    noteId,
  );

  assert.equal(response.status, 204);
  assert.equal(harness.records.has(noteId), false);
});

test("GET relasi mengembalikan koleksi pengguna sendiri", async () => {
  const harness = createHarness();
  addOwnedNote(harness, noteId, ownerId);

  const response = await harness.api.getUserNotes(
    makeRequest(`/api/v1/users/${ownerId}/notes`),
    ownerId,
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.data.length, 1);
});

test("GET relasi tidak membocorkan catatan pengguna lain", async () => {
  const harness = createHarness();

  const response = await harness.api.getUserNotes(
    makeRequest(`/api/v1/users/${otherUserId}/notes`),
    otherUserId,
  );

  assert.equal(response.status, 404);
});
