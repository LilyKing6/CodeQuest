import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { levelProgress, userStats } from "@/lib/db/schema";
import { findLevelWithContext } from "@/content/registry";
import { isLevelUnlocked, type ProgressMap } from "@/lib/progress-rules";
import { scoreLevel } from "@/lib/scoring";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const [rows, stats] = await Promise.all([
    db.select().from(levelProgress).where(eq(levelProgress.userId, userId)),
    db.select().from(userStats).where(eq(userStats.userId, userId)),
  ]);

  const progress: ProgressMap = {};
  for (const row of rows) progress[row.levelId] = row.stars;

  return NextResponse.json({
    progress,
    stats: stats[0] ?? {
      totalXp: 0,
      levelsCleared: 0,
      totalStars: 0,
      achievements: [],
    },
  });
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  let body: {
    levelId?: string;
    submission?: { kind: "quiz"; answers: number[] } | { kind: "minigame"; performance: number };
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { levelId, submission } = body;
  if (!levelId || !submission?.kind) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const ctx = findLevelWithContext(levelId);
  if (!ctx) {
    return NextResponse.json({ error: "level not found" }, { status: 404 });
  }

  // 只允许已解锁关卡的成绩入账（防跳关刷分）
  const existingRows = await db
    .select({ levelId: levelProgress.levelId, stars: levelProgress.stars })
    .from(levelProgress)
    .where(eq(levelProgress.userId, userId));
  const progressMap: ProgressMap = {};
  for (const row of existingRows) progressMap[row.levelId] = row.stars;
  if (!isLevelUnlocked(progressMap, ctx.themeIndex, ctx.levelIndex)) {
    return NextResponse.json({ error: "level locked" }, { status: 403 });
  }

  // 服务端权威计分
  const result = scoreLevel(ctx.level, submission);
  if (!result.passed) {
    return NextResponse.json({ passed: false, stars: 0, xp: 0 });
  }

  const prev = (
    await db
      .select()
      .from(levelProgress)
      .where(and(eq(levelProgress.userId, userId), eq(levelProgress.levelId, levelId)))
  )[0];

  const isNewClear = !prev;
  const starDelta = result.stars - (prev?.stars ?? 0);
  const scoreDelta = Math.max(0, result.stars * 100 + result.xp - (prev?.bestScore ?? 0));

  if (isNewClear) {
    await db.insert(levelProgress).values({
      userId,
      levelId,
      stars: result.stars,
      bestScore: result.stars * 100 + result.xp,
      timesPlayed: 1,
    });
  } else {
    await db
      .update(levelProgress)
      .set({
        stars: Math.max(prev.stars, result.stars),
        bestScore: Math.max(prev.bestScore, result.stars * 100 + result.xp),
        timesPlayed: prev.timesPlayed + 1,
        completedAt: sql`unixepoch()`,
      })
      .where(eq(levelProgress.id, prev.id));
  }

  // 更新聚合统计（XP 只按增量累加，重复通关不重复拿 XP）
  const gainedXp = isNewClear ? result.xp : 0;
  const gainedStars = Math.max(0, starDelta);

  await db
    .insert(userStats)
    .values({
      userId,
      totalXp: gainedXp,
      levelsCleared: isNewClear ? 1 : 0,
      totalStars: gainedStars,
      achievements: [],
    })
    .onConflictDoUpdate({
      target: userStats.userId,
      set: {
        totalXp: sql`${userStats.totalXp} + ${gainedXp}`,
        levelsCleared: sql`${userStats.levelsCleared} + ${isNewClear ? 1 : 0}`,
        totalStars: sql`${userStats.totalStars} + ${gainedStars}`,
        updatedAt: sql`unixepoch()`,
      },
    });

  return NextResponse.json({
    passed: true,
    stars: Math.max(prev?.stars ?? 0, result.stars),
    xpGained: gainedXp,
    newRecord: result.stars > (prev?.stars ?? 0),
  });
}
