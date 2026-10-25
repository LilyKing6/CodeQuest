/**
 * 体验账号种子脚本（开发用）：
 *   1. 通过运行中的 dev server 注册/登录 demo 账号（密码哈希由 better-auth 处理）
 *   2. 直接在 SQLite 中给全部关卡点亮 1 星 —— 所有内容立即可体验/检测
 *
 * 用法：先 `pnpm dev`，然后 `node scripts/seed-demo.mjs`
 *
 * ⚠️ 新增主题/关卡时，同步更新下面 LEVELS 列表。
 */
import { createClient } from "@libsql/client";

const BASE_URL = process.env.SEED_BASE_URL ?? "http://localhost:3000";
const DEMO_EMAIL = "demo@cs-quest.dev";
const DEMO_PASSWORD = "demo12345";
const DEMO_NAME = "体验官";

const LEVELS = [
  // binary
  "binary-1", "binary-2", "binary-3", "binary-4", "binary-5",
  // cpu
  "cpu-1", "cpu-2", "cpu-3", "cpu-4", "cpu-5",
  // os
  "os-1", "os-2", "os-3", "os-4", "os-5",
  // network
  "network-1", "network-2", "network-3", "network-4", "network-5", "network-6",
  // algorithms
  "algo-1", "algo-2", "algo-3", "algo-4", "algo-5",
  // database
  "db-1", "db-2", "db-3", "db-4", "db-5", "db-6",
  // webdev
  "web-1", "web-2", "web-3", "web-4", "web-5", "web-6",
  // security
  "sec-1", "sec-2", "sec-3", "sec-4", "sec-5", "sec-6",
];

function resolveDbUrl() {
  const raw = process.env.DATABASE_URL ?? "file:./data/local.db";
  if (!raw.startsWith("file:")) return raw;
  return raw; // 相对路径在项目根目录执行时正确解析
}

async function ensureAccount() {
  const headers = { "content-type": "application/json", Origin: BASE_URL };
  // 尝试注册；已存在则忽略错误
  const res = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name: DEMO_NAME, email: DEMO_EMAIL, password: DEMO_PASSWORD }),
  });
  if (res.ok) return "created";
  const body = await res.text().catch(() => "");
  if (/exist/i.test(body) || res.status === 422) return "exists";
  // 无法区分时再看登录
  const login = await fetch(`${BASE_URL}/api/auth/sign-in/email`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD }),
  });
  if (login.ok) return "exists";
  throw new Error(`注册与登录均失败：signup=${res.status} ${body.slice(0, 120)}`);
}

const client = createClient({ url: resolveDbUrl() });

console.log(`[seed] 账号注册状态: ${await ensureAccount()}`);

const found = await client.execute({
  sql: "SELECT id FROM user WHERE email = ?",
  args: [DEMO_EMAIL],
});
if (found.rows.length === 0) throw new Error("用户未找到（server 与脚本是否指向同一数据库？）");
const userId = found.rows[0].id;

let seeded = 0;
for (const levelId of LEVELS) {
  await client.execute({
    sql: `INSERT INTO level_progress (user_id, level_id, stars, best_score, times_played)
          VALUES (?, ?, 1, 100, 1)
          ON CONFLICT (user_id, level_id) DO UPDATE SET stars = MAX(stars, 1)`,
    args: [userId, levelId],
  });
  seeded++;
}

await client.execute({
  sql: `INSERT INTO user_stats (user_id, total_xp, levels_cleared, total_stars, achievements)
        VALUES (?, 620, ?, ?, '[]')
        ON CONFLICT (user_id) DO UPDATE SET
          levels_cleared = MAX(levels_cleared, excluded.levels_cleared),
          total_stars = MAX(total_stars, excluded.total_stars)`,
  args: [userId, LEVELS.length, LEVELS.length],
});

console.log(`[seed] 完成：${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
console.log(`[seed] 全部 ${seeded} 关已点亮 1 星（可自由体验/检测任意关卡）`);
