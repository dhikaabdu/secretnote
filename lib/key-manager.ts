
import {
  mkdir,
  open,
  readFile,
} from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { generateKey } from "./crypto.ts";

const KEY_LENGTH = 32;

function getKeyPath(): string {
  return resolve(
    process.env.SECRETNOTE_KEY_PATH ??
      "D:\\SECRETNOTE-SECRETS\\secret-note.key",
  );
}

export async function saveKey(): Promise<void> {
  const key = generateKey();
  const keyPath = getKeyPath();

  await mkdir(dirname(keyPath), { recursive: true });

  let file;

  try {
    file = await open(keyPath, "wx", 0o600);
    await file.writeFile(key.toString("base64"), "utf8");
  } finally {
    await file?.close();
  }
}

export async function loadKey(): Promise<Buffer> {
  const keyPath = getKeyPath();
  const storedKey = await readFile(keyPath, "utf8");
  const normalizedKey = storedKey.trim();

  if (
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
      normalizedKey,
    )
  ) {
    throw new Error("Format kunci tidak valid.");
  }

  const key = Buffer.from(normalizedKey, "base64");

  if (
    key.length !== KEY_LENGTH ||
    key.toString("base64") !== normalizedKey
  ) {
    throw new Error("Panjang atau format kunci tidak valid.");
  }

  return key;
}
