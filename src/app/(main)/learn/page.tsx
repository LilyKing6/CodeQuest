import type { Metadata } from "next";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { levelProgress } from "@/lib/db/schema";
import { THEMES } from "@/content/registry";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LearnMapClient } from "./LearnMapClient";

export const metadata: Metadata = { title: "闯关地图" };
export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const progress: Record<string, number> = {};
  if (session?.user) {
    const rows = await db
      .select({ levelId: levelProgress.levelId, stars: levelProgress.stars })
      .from(levelProgress)
      .where(eq(levelProgress.userId, session.user.id));
    for (const r of rows) progress[r.levelId] = r.stars;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-10 text-center">
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
            </p>
          </div>
        )}
      </div>

      <LearnMapClient progress={progress} authed={Boolean(session?.user)} />
    </div>
  );
}
