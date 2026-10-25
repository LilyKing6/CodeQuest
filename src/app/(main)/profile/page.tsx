import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { desc, gt, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { levelProgress, userStats } from "@/lib/db/schema";
import { ALL_LEVELS, THEMES } from "@/content/registry";
import { totalStarsPossible, type ProgressMap } from "@/lib/progress-rules";
import { Stars } from "@/components/ui/Stars";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = { title: "个人中心" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");
  const userId = session.user.id;

  const [rows, statRows] = await Promise.all([
    db.select().from(levelProgress).where(eq(levelProgress.userId, userId)),
    db.select().from(userStats).where(eq(userStats.userId, userId)),
  ]);
  const stats = statRows[0];

  const progress: ProgressMap = {};
  for (const r of rows) progress[r.levelId] = r.stars;
  const cleared = rows.filter((r) => r.stars > 0);
  const stars = cleared.reduce((s, r) => s + r.stars, 0);

  // 排名
  let rank: number | null = null;
  if (stats && stats.totalXp > 0) {
    const ahead = (
      await db
        .select({ n: sql<number>`count(*)` })
        .from(userStats)
        .where(gt(userStats.totalXp, stats.totalXp))
    )[0];
    rank = Number(ahead.n) + 1;
  }

  // 成就
  const achievements = computeAchievements(progress, stats?.totalXp ?? 0);

  // 最近通关
  const recent = [...cleared].sort(
    (a, b) => (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0),
  ).slice(0, 5);
  const levelTitle = (id: string) => ALL_LEVELS.find((l) => l.id === id)?.title ?? id;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* 头部 */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-neon to-cyan text-2xl font-black text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]">
          {session.user.name.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-black">{session.user.name}</h1>
          <p className="mt-0.5 truncate text-sm text-ink-faint">{session.user.email}</p>
        </div>
        {rank !== null && (
          <div className="text-right">
            <p className="font-mono text-3xl font-black text-neon-strong">#{rank}</p>
            <p className="text-xs text-ink-faint">全站排名</p>
          </div>
        )}
      </div>

      {/* 数据卡 */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="总 XP" value={stats?.totalXp ?? 0} mono />
        <StatCard label="已通关" value={`${cleared.length} / ${ALL_LEVELS.length}`} />
        <StatCard
          label="星星"
          value={
            <span className="inline-flex items-center gap-1.5">
              {stars}
              <Stars filled={3} total={0} className="scale-75" />
            </span>
          }
        />
        <StatCard label="注册天数" value={daysSince(session.user.createdAt ?? new Date())} />
      </div>

      {/* 总进度 */}
      <section className="card mt-6 p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-bold">冒险进度</h2>
          <span className="font-mono text-xs text-ink-faint">
            {cleared.length}/{ALL_LEVELS.length} 关 · {stars}/{totalStarsPossible()} 星
          </span>
        </div>
        <ProgressBar value={stars} max={totalStarsPossible()} className="mt-4 h-2.5" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((t) => {
            const done = t.levels.filter((l) => (progress[l.id] ?? 0) > 0).length;
            const st = t.levels.reduce((s, l) => s + (progress[l.id] ?? 0), 0);
            return (
              <div key={t.id} className="rounded-xl border border-line bg-surface-2 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <span>{t.icon}</span>
                  {t.title}
                </p>
                <p className="mt-1 font-mono text-xs text-ink-faint">
                  {done}/{t.levels.length} 关 · {st}/{t.levels.length * 3} ★
                </p>
                <ProgressBar value={st} max={t.levels.length * 3} className="mt-2 h-1.5" />
              </div>
            );
          })}
        </div>
      </section>

      {/* 成就 */}
      <section className="card mt-6 p-6">
        <h2 className="font-bold">成就墙</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${
                a.earned
                  ? "border-warn/40 bg-warn/5"
                  : "border-dashed border-line opacity-50"
              }`}
            >
              <span className={`text-2xl ${a.earned ? "" : "grayscale"}`}>{a.icon}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{a.title}</p>
                <p className="truncate text-xs text-ink-faint">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 最近通关 */}
      {recent.length > 0 && (
        <section className="card mt-6 p-6">
          <h2 className="font-bold">最近通关</h2>
          <ul className="mt-3 divide-y divide-line">
            {recent.map((r) => (
              <li key={r.id} className="flex items-center gap-3 py-2.5 text-sm">
                <Stars filled={r.stars} className="scale-75" />
                <span className="min-w-0 flex-1 truncate">{levelTitle(r.levelId)}</span>
                <span className="font-mono text-xs text-ink-faint">
                  {r.completedAt ? r.completedAt.toLocaleDateString("zh-CN") : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8 text-center">
        <LinkButton href="/learn">继续冒险 →</LinkButton>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="card p-4 text-center">
      <p className={`text-xl font-black text-neon-strong ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-ink-faint">{label}</p>
    </div>
  );
}

function daysSince(d: Date): number {
  return Math.max(1, Math.floor((Date.now() - d.getTime()) / 86400000));
}

interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  earned: boolean;
}

function computeAchievements(progress: ProgressMap, totalXp: number): Achievement[] {
  const cleared = Object.values(progress).filter((s) => s > 0);
  const perfect = Object.values(progress).filter((s) => s === 3).length;
  const firstGame = Object.keys(progress).some((id) =>
    ALL_LEVELS.some((l) => l.id === id && l.type === "minigame"),
  );
  const themesCleared = THEMES.filter((t) =>
    t.levels.every((l) => (progress[l.id] ?? 0) > 0),
  ).length;

  return [
    {
      id: "first-blood",
      icon: "🎬",
      title: "初次冒险",
      desc: "通过第 1 关",
      earned: cleared.length >= 1,
    },
    {
      id: "bit-lord",
      icon: "⚡",
      title: "二进制领主",
      desc: "通关「二进制与逻辑门」全关卡",
      earned: themesCleared >= 1,
    },
    {
      id: "gamer",
      icon: "🕹️",
      title: "游戏玩家",
      desc: "完成 1 个互动小游戏",
      earned: firstGame,
    },
    {
      id: "perfectionist",
      icon: "💎",
      title: "完美主义者",
      desc: "拿到 3 个 3 星通关",
      earned: perfect >= 3,
    },
    {
      id: "explorer",
      icon: "🧭",
      title: "大陆探索者",
      desc: "通过 10 个关卡",
      earned: cleared.length >= 10,
    },
    {
      id: "xp-1000",
      icon: "🌟",
      title: "千星之旅",
      desc: "累计获得 1000 XP",
      earned: totalXp >= 1000,
    },
    {
      id: "halfway",
      icon: "🏔️",
      title: "翻山越岭",
      desc: "通过 13 个关卡（半程）",
      earned: cleared.length >= 13,
    },
    {
      id: "master",
      icon: "👑",
      title: "CS 大师",
      desc: "通关全部 5 片大陆",
      earned: themesCleared >= THEMES.length,
    },
  ];
}
