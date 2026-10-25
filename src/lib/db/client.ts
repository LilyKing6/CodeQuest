import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * DATABASE_URL 形如 file:./data/local.db（开发）或 file:/data/cs-quest.db（Docker 卷）。
 * libsql 只会创建文件不会创建目录，这里先确保目录存在。
 */
function resolveDatabasePath(url: string): string {
  if (!url.startsWith("file:")) return url; // 内存库 / 远程 libsql，直接透传
  const filePart = url.slice("file:".length);
  const abs = path.isAbsolute(filePart)
    ? filePart
    : path.join(/* turbopackIgnore: true */ process.cwd(), filePart);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  return `file:${abs.split(path.sep).join("/")}`;
}

export const databaseUrl =
  process.env.DATABASE_URL ?? "file:./data/local.db";

export const client = createClient({
  url: resolveDatabasePath(databaseUrl),
});

export const db = drizzle(client, { schema });
