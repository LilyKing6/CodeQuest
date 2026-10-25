/**
 * 服务器启动时自动应用数据库迁移（幂等）。
 * 免去部署时手动跑迁移的步骤，Docker 每次启动自动对齐 schema。
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { migrate } = await import("drizzle-orm/libsql/migrator");
  const { db } = await import("@/lib/db/client");
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("[db] migrations applied");
}
