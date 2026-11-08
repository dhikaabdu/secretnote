
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32;
const NONCE_LENGTH = 12;
const TAG_LENGTH = 16;

// AAD tetap untuk konteks format enkripsi SecretNote.
const AAD = Buffer.from("SecretNote:v1:aes-256-gcm", "utf8");

export interface EncryptedNote {
  version: 1;
  algorithm: "aes-256-gcm";
  nonce: string;
  ciphertext: string;
  tag: string;
  aad: string;
}

export function generateKey(): Buffer {
  return randomBytes(KEY_LENGTH);
}

function validateKey(key: Buffer): void {
  if (!Buffer.isBuffer(key) || key.length !== KEY_LENGTH) {
    throw new Error("Kunci harus berukuran 32 byte.");
  }
}

function decodeBase64(value: string, field: string): Buffer {
  if (
    typeof value !== "string" ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)
  ) {
    throw new Error(`${field} bukan representasi Base64 yang valid.`);
  }

  const decoded = Buffer.from(value, "base64");

  if (decoded.toString("base64") !== value) {
    throw new Error(`${field} memiliki format Base64 tidak valid.`);
  }

  return decoded;
}

export function encryptNote(
  plaintext: string,
  key: Buffer,
): EncryptedNote {
  validateKey(key);

  if (typeof plaintext !== "string") {
    throw new Error("Catatan harus berupa teks.");
  }

  const nonce = randomBytes(NONCE_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, nonce);

  cipher.setAAD(AAD);

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  return {
    version: 1,
    algorithm: ALGORITHM,
    nonce: nonce.toString("base64"),
    ciphertext: ciphertext.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    aad: AAD.toString("base64"),
  };
}

export function decryptNote(
  encrypted: EncryptedNote,
  key: Buffer,
): string {
  validateKey(key);

  if (
    !encrypted ||
    typeof encrypted !== "object" ||
    encrypted.version !== 1 ||
    encrypted.algorithm !== ALGORITHM ||
    typeof encrypted.nonce !== "string" ||
    typeof encrypted.ciphertext !== "string" ||
    typeof encrypted.tag !== "string" ||
    typeof encrypted.aad !== "string"
  ) {
    throw new Error("Format data terenkripsi tidak valid.");
  }

  const nonce = decodeBase64(encrypted.nonce, "Nonce");
  const ciphertext = decodeBase64(encrypted.ciphertext, "Ciphertext");
  const tag = decodeBase64(encrypted.tag, "Authentication tag");
  const aad = decodeBase64(encrypted.aad, "AAD");

  if (
    nonce.length !== NONCE_LENGTH ||
    tag.length !== TAG_LENGTH ||
    !aad.equals(AAD)
  ) {
    throw new Error("Parameter autentikasi tidak valid.");
  }

  const decipher = createDecipheriv(ALGORITHM, key, nonce);
  decipher.setAAD(aad);
  decipher.setAuthTag(tag);

  // Plaintext hanya dikembalikan setelah autentikasi berhasil.
  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return plaintext.toString("utf8");
}
