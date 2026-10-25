import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { findLevelWithContext, nextLevelOf } from "@/content/registry";
import { isFreePlayLevel } from "@/lib/progress-rules";
import { LevelClient } from "./LevelClient";

export async function generateMetadata(
  { params }: { params: Promise<{ levelId: string }> },
): Promise<Metadata> {
  const { levelId } = await params;
  const ctx = findLevelWithContext(levelId);
  return { title: ctx ? ctx.level.title : "关卡" };
}

export default async function PlayPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  const ctx = findLevelWithContext(levelId);
  if (!ctx) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const authed = Boolean(session?.user);

  // 未登录只开放每个主题的第一关
  if (!authed && !isFreePlayLevel(levelId)) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
        <p className="font-mono text-sm text-ink-faint">// 401 · LOCKED</p>
        <h1 className="mt-3 text-2xl font-bold">这一关需要登录后挑战</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-dim">
          注册完全免费：进度云端保存、点亮星星、登上排行榜。
          每个主题的第一关无需登录，可以先去体验。
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/register" className="btn-neon">
            免费注册
          </Link>
          <Link href="/learn" className="btn-ghost">
            回到地图
          </Link>
        </div>
      </div>
    );
  }

  const next = nextLevelOf(levelId);

  return (
    <LevelClient
      level={ctx.level}
      themeTitle={ctx.theme.title}
      themeColor={ctx.theme.color}
      nextLevelId={next?.id ?? null}
      authed={authed}
    />
  );
}
