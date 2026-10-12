
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32;
const NONCE_LENGTH = 12;
const TAG_LENGTH = 16;

export interface EncryptedNote {
  version: 1;
  algorithm: "aes-256-gcm";
  nonce: string;
  ciphertext: string;
  tag: string;
}

export function generateKey(): Buffer {
  return randomBytes(KEY_LENGTH);
}

export function encryptNote(
  plaintext: string,
  key: Buffer,
): EncryptedNote {
  if (!Buffer.isBuffer(key) || key.length !== KEY_LENGTH) {
    throw new Error("Kunci harus berukuran 32 byte.");
  }

  if (typeof plaintext !== "string") {
    throw new Error("Catatan harus berupa teks.");
  }

  const nonce = randomBytes(NONCE_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, nonce);

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  return {
    version: 1,
    algorithm: "aes-256-gcm",
    nonce: nonce.toString("base64"),
    ciphertext: ciphertext.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
  };
}

export function decryptNote(
  encrypted: EncryptedNote,
  key: Buffer,
): string {
  if (!Buffer.isBuffer(key) || key.length !== KEY_LENGTH) {
    throw new Error("Kunci harus berukuran 32 byte.");
  }

  if (
    !encrypted ||
    encrypted.version !== 1 ||
    encrypted.algorithm !== ALGORITHM ||
    typeof encrypted.nonce !== "string" ||
    typeof encrypted.ciphertext !== "string" ||
    typeof encrypted.tag !== "string"
  ) {
    throw new Error("Format data terenkripsi tidak valid.");
  }

  const nonce = Buffer.from(encrypted.nonce, "base64");
  const ciphertext = Buffer.from(encrypted.ciphertext, "base64");
  const tag = Buffer.from(encrypted.tag, "base64");

  if (
    nonce.length !== NONCE_LENGTH ||
    tag.length !== TAG_LENGTH ||
    nonce.toString("base64") !== encrypted.nonce ||
    tag.toString("base64") !== encrypted.tag ||
    ciphertext.toString("base64") !== encrypted.ciphertext
  ) {
    throw new Error("Representasi data terenkripsi tidak valid.");
  }

  const decipher = createDecipheriv(ALGORITHM, key, nonce);
  decipher.setAuthTag(tag);

  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return plaintext.toString("utf8");
}
