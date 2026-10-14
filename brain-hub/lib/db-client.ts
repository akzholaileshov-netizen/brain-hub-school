import { createClient, type Client } from "@libsql/client";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_DB_PATH = path.join(DATA_DIR, "brain-hub.db");

declare global {
  var __brainHubLibsql: Client | undefined;
}

export function resolveDatabaseConfig() {
  const url = process.env.DATABASE_URL?.trim();
  const authToken = process.env.DATABASE_AUTH_TOKEN?.trim();

  if (url && (url.startsWith("libsql://") || url.startsWith("https://"))) {
    if (!authToken && process.env.NODE_ENV === "production") {
      throw new Error(
        "DATABASE_AUTH_TOKEN қажет (Turso/libSQL). .env.example қараңыз.",
      );
    }
    return { url, authToken };
  }

  if (url?.startsWith("file:")) {
    return { url, authToken: undefined };
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  // Absolute file URL for local SQLite fallback (zero-setup dev)
  const fileUrl = `file:${LOCAL_DB_PATH}`;
  return { url: fileUrl, authToken: undefined };
}

export function getClient(): Client {
  if (!global.__brainHubLibsql) {
    const config = resolveDatabaseConfig();
    global.__brainHubLibsql = createClient({
      url: config.url,
      authToken: config.authToken,
    });
  }
  return global.__brainHubLibsql;
}

export async function execute(sql: string, args: Array<string | number | null> = []) {
  return getClient().execute({ sql, args });
}

export async function executeBatch(statements: string[]) {
  const client = getClient();
  // Prefer sequential executes for broad libsql compatibility
  for (const sql of statements) {
    await client.execute(sql);
  }
}

export async function getRow<T>(
  sql: string,
  args: Array<string | number | null> = [],
): Promise<T | undefined> {
  const result = await execute(sql, args);
  const row = result.rows[0];
  return row as T | undefined;
}

export async function getAll<T>(
  sql: string,
  args: Array<string | number | null> = [],
): Promise<T[]> {
  const result = await execute(sql, args);
  return result.rows as T[];
}

export async function run(
  sql: string,
  args: Array<string | number | null> = [],
) {
  const result = await execute(sql, args);
  return {
    lastInsertRowid: Number(result.lastInsertRowid ?? 0),
    changes: result.rowsAffected,
  };
}
