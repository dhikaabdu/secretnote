
import test from "node:test";
import assert from "node:assert/strict";

import {
  decryptNote,
  encryptNote,
  generateKey,
} from "../lib/crypto.ts";

test("1. Catatan dapat dienkripsi dan didekripsi kembali", () => {
  const key = generateKey();
  const plaintext = "Catatan kuliah kriptografi";

  const encrypted = encryptNote(plaintext, key);
  const decrypted = decryptNote(encrypted, key);

  assert.equal(decrypted, plaintext);
  assert.notEqual(encrypted.ciphertext, plaintext);
});

test("2. Catatan kosong dapat diproses", () => {
  const key = generateKey();

  const encrypted = encryptNote("", key);
  const decrypted = decryptNote(encrypted, key);

  assert.equal(decrypted, "");
});

test("3. Enkripsi menghasilkan nonce berbeda", () => {
  const key = generateKey();
  const plaintext = "Catatan sintetis";

  const first = encryptNote(plaintext, key);
  const second = encryptNote(plaintext, key);

  assert.notEqual(first.nonce, second.nonce);
});

test("4. Kunci yang salah menyebabkan dekripsi gagal", () => {
  const key = generateKey();
  const wrongKey = generateKey();
  const encrypted = encryptNote("Catatan rahasia", key);

  assert.throws(() => decryptNote(encrypted, wrongKey));
});

test("5. Ciphertext yang diubah menyebabkan dekripsi gagal", () => {
  const key = generateKey();
  const encrypted = encryptNote("Catatan rahasia", key);

  const tampered = {
    ...encrypted,
    ciphertext:
      (encrypted.ciphertext.startsWith("A") ? "B" : "A") +
      encrypted.ciphertext.slice(1),
  };

  assert.throws(() => decryptNote(tampered, key));
});
