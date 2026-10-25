import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { desc, eq, gt, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { user, userStats } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const top = await db
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
  let me: { rank: number; totalXp: number } | null = null;
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
      me = { rank: Number(ahead.n) + 1, totalXp: mine.totalXp };
    }
  }

  return NextResponse.json({ top, me });
}
