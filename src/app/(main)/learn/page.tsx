import type { Metadata } from "next";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { levelProgress, userStats } from "@/lib/db/schema";
import { THEMES, findLevelWithContext } from "@/content/registry";
import { dailyLevelId } from "@/lib/daily";
import { utcDateStr } from "@/lib/streak";
import { isLevelUnlocked, type ProgressMap } from "@/lib/progress-rules";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { DailyCard } from "./DailyCard";
import { LearnMapClient } from "./LearnMapClient";

export const metadata: Metadata = { title: "闯关地图" };
export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const progress: Record<string, number> = {};
  let dailyDone = false;
  let streakDays = 0;
  if (session?.user) {
    const [rows, statRows] = await Promise.all([
      db
        .select({ levelId: levelProgress.levelId, stars: levelProgress.stars })
        .from(levelProgress)
        .where(eq(levelProgress.userId, session.user.id)),
      db.select().from(userStats).where(eq(userStats.userId, session.user.id)),
    ]);
    for (const r of rows) progress[r.levelId] = r.stars;
    dailyDone = statRows[0]?.dailyDoneDate === utcDateStr();
    streakDays = statRows[0]?.streakDays ?? 0;
  }

  // 每日挑战状态
  const today = utcDateStr();
  const daily = findLevelWithContext(dailyLevelId(today));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black sm:text-4xl">闯关地图</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim sm:text-base">
          按顺序解锁：通关一个关卡点亮下一关；
          每片大陆通关 80% 后，下一片大陆的大门将打开。
        </p>
        {session?.user && (
          <div className="mx-auto mt-6 max-w-md">
            <ProgressBar
              value={Object.values(progress).filter((s) => s > 0).length}
              max={THEMES.reduce((n, t) => n + t.levels.length, 0)}
            />
            <p className="mt-2 font-mono text-xs text-ink-faint">
              总进度 {Object.values(progress).filter((s) => s > 0).length} /{" "}
              {THEMES.reduce((n, t) => n + t.levels.length, 0)} 关
              {streakDays > 0 && <span className="ml-2 text-warn">🔥 连续 {streakDays} 天</span>}
            </p>
          </div>
        )}
      </div>

      {daily && (
        <DailyCard
          daily={{
            id: daily.level.id,
            title: daily.level.title,
            icon: daily.theme.icon,
            type: daily.level.type,
          }}
          themeTitle={daily.theme.title}
          themeColor={daily.theme.color}
          locked={
            session?.user
              ? !isLevelUnlocked(progress as ProgressMap, daily.themeIndex, daily.levelIndex)
              : false
          }
          done={dailyDone}
          signedIn={Boolean(session?.user)}
        />
      )}

      <LearnMapClient progress={progress} authed={Boolean(session?.user)} />
    </div>
  );
}
