"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { StarIcon } from "@/components/ui/Stars";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Level } from "@/content/types";

export interface ResultState {
  passed: boolean;
  /** 结算星（本地玩法表现，游客也可见） */
  stars: number;
  xp: number;
  /** 服务端入账提示（游客为 not-authed） */
  saveState: "saved" | "not-authed" | "error";
  level: Level;
  nextLevelId: string | null;
  onRetry: () => void;
}

export function ResultScreen({
  passed,
  stars,
  xp,
  saveState,
  level,
  nextLevelId,
  onRetry,
}: ResultState) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="mx-auto max-w-lg"
    >
      <div
        className={`card relative overflow-hidden p-8 text-center ${passed ? "animate-glow-pulse" : ""}`}
      >
        <p className="font-mono text-sm text-ink-faint">
          {passed ? "// LEVEL CLEARED" : "// TRY AGAIN"}
        </p>
        <h2 className="mt-2 text-3xl font-black">
          {passed ? "通关成功！" : "还差一点点"}
        </h2>

        {passed ? (
          <>
            <div className="mt-6 flex justify-center gap-3">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.25 + i * 0.22, type: "spring", stiffness: 300 }}
                >
                  <StarIcon
                    filled={i < stars}
                    className={`size-12 ${i < stars ? "" : "opacity-40"}`}
                  />
                </motion.span>
              ))}
            </div>
            <p className="mt-4 font-mono text-lg text-xp">+{xp} XP</p>
            <p className="mt-2 text-sm text-ink-dim">
              {saveState === "saved" && "成绩已保存并计入排行榜 ✅"}
              {saveState === "not-authed" && (
                <>
                  本地演示成绩未保存，
                  <Link href="/register" className="text-neon-strong hover:underline">
                    注册
                  </Link>
                  后可点亮星星、冲击排行榜
                </>
              )}
              {saveState === "error" && "成绩保存失败，网络恢复后重玩一次即可补记"}
            </p>
          </>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-ink-dim">
            没关系，错误是学习的一部分。回顾刚才的解析，再试一次！
          </p>
        )}

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button onClick={onRetry} variant="ghost">
            再玩一次 ↺
          </Button>
          {passed && nextLevelId ? (
            <Link href={`/play/${nextLevelId}`} className="btn-neon">
              下一关 →
            </Link>
          ) : (
            <Link href="/learn" className="btn-neon">
              回到地图
            </Link>
          )}
        </div>
      </div>

      {passed && (
        <div className="mt-4 flex justify-center">
          <Badge tone="cyan">{level.title} · 完成</Badge>
        </div>
      )}
    </motion.div>
  );
}
