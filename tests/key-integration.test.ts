
import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtemp,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { encryptNote, decryptNote } from "../lib/crypto.ts";
import { saveKey, loadKey } from "../lib/key-manager.ts";

test("1. Kunci eksternal dapat digunakan untuk enkripsi dan dekripsi", async () => {
  const directory = await mkdtemp(join(tmpdir(), "secretnote-"));
  const previousKeyPath = process.env.SECRETNOTE_KEY_PATH;

  process.env.SECRETNOTE_KEY_PATH = join(directory, "secret-note.key");

  try {
    await saveKey();

    const keyForEncryption = await loadKey();
    const encrypted = encryptNote("Catatan SecretNote", keyForEncryption);

    const keyForDecryption = await loadKey();
    const decrypted = decryptNote(encrypted, keyForDecryption);

    assert.equal(decrypted, "Catatan SecretNote");
  } finally {
    await rm(directory, { recursive: true, force: true });

    if (previousKeyPath === undefined) {
      delete process.env.SECRETNOTE_KEY_PATH;
    } else {
      process.env.SECRETNOTE_KEY_PATH = previousKeyPath;
    }
  }
});
