import type { Metadata } from "next";
import { desc, eq, gt, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { user, userStats } from "@/lib/db/schema";
import { Stars } from "@/components/ui/Stars";

export const metadata: Metadata = { title: "排行榜" };
export const dynamic = "force-dynamic";

interface Row {
  userId: string;
  name: string;
  totalXp: number;
  levelsCleared: number;
  totalStars: number;
}

export default async function LeaderboardPage() {
  const top: Row[] = await db
    .select({
      userId: userStats.userId,
      name: user.name,
      totalXp: userStats.totalXp,
      levelsCleared: userStats.levelsCleared,
      totalStars: userStats.totalStars,
    })
    .from(userStats)
    .innerJoin(user, eq(user.id, userStats.userId))
    .where(gt(userStats.totalXp, 0))
    .orderBy(desc(userStats.totalXp), desc(userStats.totalStars))
    .limit(100);

  const session = await auth.api.getSession({ headers: await headers() });
  let me: { rank: number; xp: number; inTop: boolean } | null = null;
  if (session?.user) {
    const mine = (
      await db
        .select({ totalXp: userStats.totalXp })
        .from(userStats)
        .where(eq(userStats.userId, session.user.id))
    )[0];
    if (mine && mine.totalXp > 0) {
      const ahead = (
        await db
          .select({ n: sql<number>`count(*)` })
          .from(userStats)
          .where(gt(userStats.totalXp, mine.totalXp))
      )[0];
      const rank = Number(ahead.n) + 1;
      me = {
        rank,
        xp: mine.totalXp,
        inTop: top.some((r) => r.userId === session.user.id),
      };
    }
  }

  const podium = top.slice(0, 3);
  const rest = top.slice(3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="text-center">
        <h1 className="text-3xl font-black">XP 排行榜</h1>
        <p className="mt-2 text-sm text-ink-dim">
          每道题、每个小游戏都是真实的 XP —— 名次是理解深度的证明
        </p>
      </div>

      {top.length === 0 ? (
        <div className="card mt-10 p-10 text-center text-ink-dim">
          <p className="text-4xl">🏆</p>
          <p className="mt-3">还没有冒险者上榜。</p>
          <p className="mt-1 text-sm text-ink-faint">
            第一个通关的人就是第一名——这个人为什么不能是你？
          </p>
        </div>
      ) : (
        <>
          {/* 前三名领奖台 */}
          <div className="mt-10 flex items-end justify-center gap-3">
            {[1, 0, 2].map((podiumIdx) => {
              const row = podium[podiumIdx];
              if (!row) return null;
              const heights = [88, 64, 48];
              const medals = ["🥇", "🥈", "🥉"];
              const h = heights[podiumIdx];
              return (
                <div key={row.userId} className="flex w-24 flex-col items-center sm:w-32">
                  <span className="text-2xl">{medals[podiumIdx]}</span>
                  <span className="mt-1 max-w-full truncate text-sm font-bold" title={row.name}>
                    {row.name}
                  </span>
                  <span className="font-mono text-xs text-xp">{row.totalXp} XP</span>
                  <div
                    className="mt-2 w-full rounded-t-xl bg-gradient-to-t from-neon/60 to-neon/25"
                    style={{ height: h }}
                  />
                </div>
              );
            })}
          </div>

          {/* 其余名次 */}
          {rest.length > 0 && (
            <ol className="card mt-8 divide-y divide-line">
              {rest.map((r, i) => (
                <li
                  key={r.userId}
                  className={`flex items-center gap-3 px-5 py-3 ${
                    me && r.userId === session?.user?.id ? "bg-neon/5" : ""
                  }`}
                >
                  <span className="w-8 shrink-0 text-center font-mono text-sm text-ink-faint">
                    {i + 4}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium">{r.name}</span>
                  <Stars filled={Math.min(3, Math.round(r.totalStars / 10))} className="hidden sm:inline-flex" />
                  <span className="font-mono text-sm text-cyan">{r.levelsCleared} 关</span>
                  <span className="w-20 text-right font-mono text-sm font-bold text-xp">
                    {r.totalXp} XP
                  </span>
                </li>
              ))}
            </ol>
          )}

          {/* 我的排名 */}
          {me && !me.inTop && (
            <p className="mt-6 text-center font-mono text-sm text-ink-dim">
              你的排名：第 {me.rank} 名 · {me.xp} XP —— 冲进前 100 就能上墙！
            </p>
          )}
        </>
      )}

      {!session?.user && (
        <p className="mt-8 text-center text-sm text-ink-faint">
          登录后可以在这里看到自己的实时排名
        </p>
      )}
    </div>
  );
}
