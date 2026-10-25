"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatePresence } from "motion/react";
import type { Level, MiniGameLevel } from "@/content/types";
import { QuizEngine } from "@/components/game/QuizEngine";
import { ResultScreen, type ResultState } from "@/components/game/ResultScreen";
import { useGameStore } from "@/lib/game-store";
import { RichText } from "@/components/game/CodeInline";

/**
 * 小游戏组件注册表：新游戏 = 新建组件文件 + 在这里加一行映射。
 * dynamic() 按需分割代码，进入对应关卡才加载对应游戏。
 */
const MINI_GAMES = {
  "binary-bulbs": dynamic(() => import("@/components/games/BinaryBulbs")),
  "logic-gates": dynamic(() => import("@/components/games/LogicGates")),
  "cpu-sim": dynamic(() => import("@/components/games/CpuSim")),
  "cpu-scheduler": dynamic(() => import("@/components/games/CpuScheduler")),
  "tcp-handshake": dynamic(() => import("@/components/games/TcpHandshake")),
  subnetting: dynamic(() => import("@/components/games/Subnetting")),
  "binary-search": dynamic(() => import("@/components/games/BinarySearch")),
  "bubble-sort": dynamic(() => import("@/components/games/BubbleSort")),
  matching: dynamic(() => import("@/components/games/Matching")),
  "sql-builder": dynamic(() => import("@/components/games/SqlBuilder")),
  "css-box": dynamic(() => import("@/components/games/CssBox")),
  "password-lab": dynamic(() => import("@/components/games/PasswordLab")),
} as const;

export function LevelClient({
  level,
  themeTitle,
  themeColor,
  nextLevelId,
  authed,
}: {
  level: Level;
  themeTitle: string;
  themeColor: string;
  nextLevelId: string | null;
  authed: boolean;
}) {
  const result = useGameStore((s) => s.result);
  const setResult = useGameStore((s) => s.setResult);

  const GameComp = level.type === "minigame" ? MINI_GAMES[level.game] : null;

  return (
    <div className="mx-auto min-h-dvh max-w-5xl px-4 pb-16 pt-8">
      {/* 顶栏 */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-xs text-ink-faint">
            <Link href="/learn" className="hover:text-ink-dim">
              闯关地图
            </Link>{" "}
            / <span style={{ color: themeColor }}>{themeTitle}</span>
          </p>
          <h1 className="mt-1 truncate text-2xl font-black">{level.title}</h1>
        </div>
        <Link href="/learn" className="btn-ghost shrink-0 !px-4 !py-2 !text-sm">
          退出关卡 ✕
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {result ? (
          <ResultScreen key="result" {...result} />
        ) : (
          <div key="play">
            <div
              className="card mb-6 border-l-4 p-5 text-sm leading-relaxed text-ink-dim"
              style={{ borderLeftColor: themeColor }}
            >
              <RichText text={level.intro} />
            </div>

            {level.type === "quiz" ? (
              <QuizEngine level={level} nextLevelId={nextLevelId} authed={authed} />
            ) : GameComp ? (
              <GameComp
                level={level as MiniGameLevel}
                nextLevelId={nextLevelId}
                authed={authed}
                onFinish={(r) =>
                  setResult({ ...r, level, nextLevelId, onRetry: () => setResult(null) })
                }
              />
            ) : null}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export type { ResultState };
