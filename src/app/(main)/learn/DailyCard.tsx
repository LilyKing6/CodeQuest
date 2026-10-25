import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { DAILY_BONUS_XP } from "@/lib/daily";

/**
 * 每日挑战卡（服务端渲染）：全站同一天同一关，当日首完成 +40 XP。
 * 逻辑均来自 lib/daily + lib/streak，展示层只做编排。
 */
export function DailyCard({
  daily,
  themeTitle,
  themeColor,
  locked,
  done,
  signedIn,
}: {
  daily: { id: string; title: string; icon: string; type: "quiz" | "minigame" };
  themeTitle: string;
  themeColor: string;
  locked: boolean;
  done: boolean;
  signedIn: boolean;
}) {
  return (
    <div
      className="card relative mb-8 overflow-hidden border-l-4 p-5"
      style={{ borderLeftColor: themeColor }}
    >
      <div className="flex flex-wrap items-center gap-4">
        <span
          className="grid size-14 shrink-0 place-items-center rounded-xl text-3xl"
          style={{ background: `${themeColor}22` }}
        >
          {daily.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold">每日挑战</h2>
            <Badge tone="warn">+{DAILY_BONUS_XP} XP</Badge>
            {done && <Badge tone="ok">今日已完成 ✓</Badge>}
          </div>
          <p className="mt-1 text-sm text-ink-dim">
            今日全站同题：<span style={{ color: themeColor }}>{themeTitle}</span>
            {" · "}
            <span className="font-medium text-ink">{daily.title}</span>
            {daily.type === "minigame" ? "（互动小游戏）" : ""}
          </p>
        </div>
        <div className="shrink-0">
          {!signedIn ? (
            <Link href="/register" className="btn-neon !px-5 !py-2 !text-sm">
              注册领奖励
            </Link>
          ) : done ? (
            <Link href="/learn" className="btn-ghost !px-5 !py-2 !text-sm">
              明天再来 ↺
            </Link>
          ) : locked ? (
            <Link href="/learn" className="btn-ghost !px-5 !py-2 !text-sm">
              先通关解锁它
            </Link>
          ) : (
            <Link href={`/play/${daily.id}`} className="btn-neon !px-5 !py-2 !text-sm">
              立即挑战 →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
