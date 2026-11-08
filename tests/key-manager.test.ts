
import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  saveKey,
  loadKey,
} from "../lib/key-manager.ts";

test("1. Kunci dapat dibuat dan disimpan", async () => {
  const directory = await mkdtemp(join(tmpdir(), "secretnote-"));
  const keyPath = join(directory, "secret-note.key");
  const previousKeyPath = process.env.SECRETNOTE_KEY_PATH;

  process.env.SECRETNOTE_KEY_PATH = keyPath;

  try {
    await saveKey();

    const storedKey = await readFile(keyPath, "utf8");
    assert.ok(storedKey.length > 0);
  } finally {
    await rm(directory, { recursive: true, force: true });

    if (previousKeyPath === undefined) {
      delete process.env.SECRETNOTE_KEY_PATH;
    } else {
      process.env.SECRETNOTE_KEY_PATH = previousKeyPath;
    }
  }
});

test("2. Kunci yang tersimpan dapat dibaca kembali", async () => {
  const directory = await mkdtemp(join(tmpdir(), "secretnote-"));
  const keyPath = join(directory, "secret-note.key");
  const previousKeyPath = process.env.SECRETNOTE_KEY_PATH;

  process.env.SECRETNOTE_KEY_PATH = keyPath;

  try {
    await saveKey();

    const key = await loadKey();

    assert.equal(key.length, 32);
  } finally {
    await rm(directory, { recursive: true, force: true });

    if (previousKeyPath === undefined) {
      delete process.env.SECRETNOTE_KEY_PATH;
    } else {
      process.env.SECRETNOTE_KEY_PATH = previousKeyPath;
    }
  }
});

test("3. Kunci lama tidak boleh tertimpa", async () => {
  const directory = await mkdtemp(join(tmpdir(), "secretnote-"));
  const keyPath = join(directory, "secret-note.key");
  const previousKeyPath = process.env.SECRETNOTE_KEY_PATH;

  process.env.SECRETNOTE_KEY_PATH = keyPath;

  try {
    await saveKey();
    const originalKey = await readFile(keyPath, "utf8");

    await assert.rejects(saveKey());

    const currentKey = await readFile(keyPath, "utf8");
    assert.equal(currentKey, originalKey);
  } finally {
    await rm(directory, { recursive: true, force: true });

    if (previousKeyPath === undefined) {
      delete process.env.SECRETNOTE_KEY_PATH;
    } else {
      process.env.SECRETNOTE_KEY_PATH = previousKeyPath;
    }
  }
});

test("4. File kunci yang tidak valid ditolak", async () => {
  const directory = await mkdtemp(join(tmpdir(), "secretnote-"));
  const keyPath = join(directory, "secret-note.key");
  const previousKeyPath = process.env.SECRETNOTE_KEY_PATH;

  process.env.SECRETNOTE_KEY_PATH = keyPath;

  try {
    await writeFile(keyPath, "kunci-tidak-valid", "utf8");

    await assert.rejects(loadKey());
  } finally {
    await rm(directory, { recursive: true, force: true });

    if (previousKeyPath === undefined) {
      delete process.env.SECRETNOTE_KEY_PATH;
    } else {
      process.env.SECRETNOTE_KEY_PATH = previousKeyPath;
    }
  }
});
