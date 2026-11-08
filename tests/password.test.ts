
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../lib/auth/password.ts";

describe("Password Security - Argon2id", () => {
  it("menghasilkan hash Argon2id, bukan plaintext", async () => {
    const password = "SecretNote-Test-Only-2026!";
    const hash = await hashPassword(password);

    assert.notEqual(hash, password);
    assert.ok(hash.startsWith("$argon2id$"));
  });

  it("memverifikasi password yang benar", async () => {
    const password = "SecretNote-Test-Only-2026!";
    const hash = await hashPassword(password);

    assert.equal(await verifyPassword(hash, password), true);
  });

  it("menolak password yang salah", async () => {
    const hash = await hashPassword("SecretNote-Test-Only-2026!");

    assert.equal(
      await verifyPassword(hash, "wrong-password"),
      false,
    );
  });

  it("menghasilkan hash berbeda karena salt acak", async () => {
    const password = "SecretNote-Test-Only-2026!";

    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    assert.notEqual(hash1, hash2);
  });

  it("menolak hash yang tidak valid", async () => {
    assert.equal(
      await verifyPassword("invalid-hash", "password"),
      false,
    );
  });
});
