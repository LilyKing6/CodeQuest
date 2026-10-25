"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { THEMES } from "@/content/registry";
import { Stars } from "@/components/ui/Stars";
import { Badge } from "@/components/ui/Badge";
import {
  isLevelUnlocked,
  isThemeUnlocked,
  themeCompletedCount,
} from "@/lib/progress-rules";

export function LearnMapClient({
  progress,
  authed,
}: {
  progress: Record<string, number>;
  authed: boolean;
}) {
  return (
    <div className="space-y-6">
      {THEMES.map((theme, t) => {
        const themeUnlocked = isThemeUnlocked(progress, t);
        const done = themeCompletedCount(progress, t);
        const starsInTheme = theme.levels.reduce(
          (s, l) => s + (progress[l.id] ?? 0),
          0,
        );

        return (
          <motion.section
            key={theme.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: t * 0.07 }}
            className={`card overflow-hidden ${themeUnlocked ? "" : "opacity-60"}`}
          >
            {/* 大陆头 */}
            <div className="flex flex-wrap items-center gap-3 border-b border-line p-5">
              <span
                className="grid size-12 shrink-0 place-items-center rounded-xl text-2xl"
                style={{ background: `${theme.color}1f` }}
              >
                {themeUnlocked ? theme.icon : "🔒"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold">{theme.title}</h2>
                  {!themeUnlocked ? (
                    <Badge tone="muted">通关上一大陆 80% 解锁</Badge>
                  ) : done === theme.levels.length ? (
                    <Badge tone="ok">已通关 🎉</Badge>
                  ) : null}
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-ink-dim">
                  {theme.description}
                </p>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs text-ink-faint">
                <span>
                  {done}/{theme.levels.length} 关
                </span>
              </div>
            </div>

            {/* 关卡链 */}
            {themeUnlocked && (
              <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
                {theme.levels.map((level, l) => {
                  const unlocked = isLevelUnlocked(progress, t, l);
                  const stars = progress[level.id] ?? 0;
                  return unlocked ? (
                    <Link
                      key={level.id}
                      href={`/play/${level.id}`}
                      className="card card-hover group flex items-center gap-3 p-4"
                    >
                      <span
                        className="grid size-10 shrink-0 place-items-center rounded-lg font-mono text-sm font-bold"
                        style={{
                          background: stars > 0 ? `${theme.color}2a` : undefined,
                          color: theme.color,
                        }}
                      >
                        {stars > 0 ? "✓" : l + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {level.title}
                        </p>
                        <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
                          {level.type === "quiz"
                            ? `${level.questions.length} 题`
                            : "互动小游戏"}
                        </p>
                      </div>
                      {stars > 0 && <Stars filled={stars} className="shrink-0 scale-90" />}
                    </Link>
                  ) : (
                    <div
                      key={level.id}
                      className="flex items-center gap-3 rounded-2xl border border-dashed border-line p-4 opacity-50"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface-2 text-ink-faint">
                        🔒
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink-faint">
                          ？？？
                        </p>
                        <p className="mt-0.5 text-[11px] text-ink-faint">
                          通关上一关解锁
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 星星汇总 */}
            {themeUnlocked && authed && (
              <div className="flex items-center gap-2 border-t border-line px-5 py-3">
                <span className="font-mono text-xs text-ink-faint">本大陆星星</span>
                <Stars filled={Math.round(starsInTheme / 3)} total={theme.levels.length} />
                <span className="font-mono text-xs text-ink-faint">
                  {starsInTheme}/{theme.levels.length * 3}
                </span>
              </div>
            )}
          </motion.section>
        );
      })}
    </div>
  );
}
