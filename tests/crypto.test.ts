
import test from "node:test";
import assert from "node:assert/strict";

import {
  decryptNote,
  encryptNote,
  generateKey,
} from "../lib/crypto.ts";

const EXPECTED_AAD = "SecretNote:v1:aes-256-gcm";

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

test("6. AAD tersedia dan sesuai dengan konteks enkripsi", () => {
  const key = generateKey();
  const plaintext = "Catatan dengan AAD";

  const encrypted = encryptNote(plaintext, key);
  const decodedAAD = Buffer.from(encrypted.aad, "base64").toString("utf8");

  assert.equal(typeof encrypted.aad, "string");
  assert.ok(encrypted.aad.length > 0);
  assert.equal(decodedAAD, EXPECTED_AAD);
  assert.equal(decryptNote(encrypted, key), plaintext);
});

test("7. AAD yang dimodifikasi menyebabkan dekripsi gagal", () => {
  const key = generateKey();
  const encrypted = encryptNote("Catatan rahasia", key);

  const tampered = {
    ...encrypted,
    aad: Buffer.from("AAD palsu", "utf8").toString("base64"),
  };

  assert.throws(() => decryptNote(tampered, key));
});

test("8. Authentication tag yang dimodifikasi ditolak", () => {
  const key = generateKey();
  const encrypted = encryptNote("Catatan rahasia", key);
  const tag = Buffer.from(encrypted.tag, "base64");

  tag[0] ^= 0x01;

  const tampered = {
    ...encrypted,
    tag: tag.toString("base64"),
  };

  assert.throws(() => decryptNote(tampered, key));
});

test("9. Nonce yang dimodifikasi menyebabkan dekripsi gagal", () => {
  const key = generateKey();
  const encrypted = encryptNote("Catatan rahasia", key);
  const nonce = Buffer.from(encrypted.nonce, "base64");

  nonce[0] ^= 0x01;

  const tampered = {
    ...encrypted,
    nonce: nonce.toString("base64"),
  };

  assert.throws(() => decryptNote(tampered, key));
});

test("10. Representasi Base64 yang tidak valid ditolak", () => {
  const key = generateKey();
  const encrypted = encryptNote("Catatan rahasia", key);

  const tampered = {
    ...encrypted,
    tag: "bukan-base64!",
  };

  assert.throws(() => decryptNote(tampered, key));
});
