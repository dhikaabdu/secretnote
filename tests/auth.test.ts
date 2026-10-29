import test from "node:test";
import assert from "node:assert/strict";

import { verifyDemoCredentials } from "../lib/auth/credentials.ts";
import {
  getNotesAccessDecision,
  isProtectedNotesPath,
} from "../lib/auth/protection.ts";
import {
  createDemoSession,
  findDemoSession,
  revokeDemoSession,
} from "../lib/auth/session-store.ts";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "../lib/auth/constants.ts";

test("kredensial demo valid dikenali tanpa mengungkap nilainya", () => {
  assert.equal(
    verifyDemoCredentials("demo-user", "fictional-password", {
      username: "demo-user",
      password: "fictional-password",
    }),
    true,
  );
});

test("kredensial demo yang tidak cocok ditolak", () => {
  assert.equal(
    verifyDemoCredentials("demo-user", "wrong-password", {
      username: "demo-user",
      password: "fictional-password",
    }),
    false,
  );
});

test("verifikasi kredensial gagal jika konfigurasi belum tersedia", () => {
  assert.equal(verifyDemoCredentials("demo-user", "fictional-password", null), false);
});

test("session yang baru dibuat valid sampai waktu kedaluwarsanya", () => {
  const now = 1_000_000;
  const { token, session } = createDemoSession(now);

  assert.equal(session.userId, "demo-user");
  assert.equal(
    session.expiresAt,
    now + SESSION_MAX_AGE_SECONDS * 1000,
  );
  assert.deepEqual(findDemoSession(token, now), session);
});

test("session tidak dikenal ditolak", () => {
  assert.equal(findDemoSession("unknown-session-token"), undefined);
});

test("session yang kedaluwarsa dihapus dan ditolak", () => {
  const now = 2_000_000;
  const { token } = createDemoSession(now);

  assert.equal(
    findDemoSession(token, now + SESSION_MAX_AGE_SECONDS * 1000),
    undefined,
  );
  assert.equal(findDemoSession(token, now), undefined);
});

test("session yang dicabut tidak dapat dipakai kembali dengan cookie lama", () => {
  const { token } = createDemoSession();

  assert.equal(revokeDemoSession(token), true);
  assert.equal(findDemoSession(token), undefined);
  assert.equal(revokeDemoSession(token), false);
});

test("route notes dan turunannya termasuk route terlindungi", () => {
  assert.equal(isProtectedNotesPath("/notes"), true);
  assert.equal(isProtectedNotesPath("/notes/new"), true);
  assert.equal(isProtectedNotesPath("/notes/123"), true);
  assert.equal(isProtectedNotesPath("/notes-old"), false);
});

test("akses awal notes tanpa cookie diarahkan ke login", () => {
  assert.equal(
    getNotesAccessDecision("/notes/new", false),
    "redirect-to-login",
  );
});

test("cookie palsu lolos pemeriksaan awal tetapi tidak dikenal session store", () => {
  assert.equal(
    getNotesAccessDecision("/notes", true),
    "continue",
  );
  assert.equal(findDemoSession("forged-cookie"), undefined);
});

test("dashboard publik tidak memerlukan session cookie", () => {
  assert.equal(getNotesAccessDecision("/", false), "continue");
  assert.equal(SESSION_COOKIE_NAME, "secretnote_session");
});
