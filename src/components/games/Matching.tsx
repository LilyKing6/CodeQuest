"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { MiniGameProps } from "./types";
import type { MatchingConfig } from "@/content/types";
import { finishMiniGame } from "./shared";
import { Badge } from "@/components/ui/Badge";

/**
 * 通用左右配对游戏（多主题复用）：
 * 点选左列一项再点右列一项，配对正确锁定变绿，错误累计。
 */
export default function Matching({ level, nextLevelId, authed, onFinish }: MiniGameProps) {
  const config = level.config as MatchingConfig;
  const accent = config.accent ?? "#8b5cf6";

  const rights = useMemo(() => shuffle(config.pairs.map((p) => p.right)), [config]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const total = config.pairs.length;

  function tryMatch(right: string) {
    if (!selectedLeft) return;
    const pair = config.pairs.find((p) => p.left === selectedLeft);
    if (pair && pair.right === right) {
      const next = new Set(matched);
      next.add(pair.left);
      setMatched(next);
      setSelectedLeft(null);
      if (next.size === total) {
        const perf = Math.max(50, 100 - mistakes * 10);
        setTimeout(() => {
          void finishMiniGame({ level, nextLevelId, authed, onFinish }, perf);
        }, 700);
      }
    } else {
      setMistakes((m) => m + 1);
      setWrongFlash(right);
      setTimeout(() => setWrongFlash(null), 550);
    }
  }

  const done = matched.size === total;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge tone="cyan">
            点击左列一项，再点右列它的小伙伴 · 共 {total} 对
          </Badge>
          <span className="font-mono text-sm">
            <span className="text-ok">✓ {matched.size}</span>
            <span className="text-ink-faint"> / {total} · 失误 </span>
            <span className={mistakes > 0 ? "text-warn" : "text-ink-faint"}>{mistakes}</span>
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-8">
          {/* 左列 */}
          <div className="space-y-2.5">
            {config.pairs.map((p) => {
              const isMatched = matched.has(p.left);
              const isSelected = selectedLeft === p.left;
              return (
                <motion.button
                  key={p.left}
                  whileTap={{ scale: 0.97 }}
                  disabled={isMatched}
                  onClick={() => setSelectedLeft(isSelected ? null : p.left)}
                  className={`min-h-14 w-full rounded-xl border-2 px-3 py-2.5 text-left text-sm font-medium leading-snug transition-all ${
                    isMatched
                      ? "border-ok/60 bg-ok/10 text-ok"
                      : isSelected
                        ? "text-white"
                        : "border-line bg-surface-2 hover:border-line-active"
                  }`}
                  style={isSelected ? { borderColor: accent, background: `${accent}33` } : undefined}
                >
                  {p.left}
                </motion.button>
              );
            })}
          </div>

          {/* 右列（乱序） */}
          <div className="space-y-2.5">
            {rights.map((r) => {
              const isMatched = config.pairs.some((p) => p.right === r && matched.has(p.left));
              const isWrong = wrongFlash === r;
              return (
                <motion.button
                  key={r}
                  whileTap={{ scale: 0.97 }}
                  animate={isWrong ? { x: [0, -7, 7, -4, 4, 0] } : {}}
                  transition={{ duration: 0.45 }}
                  onClick={() => tryMatch(r)}
                  className={`min-h-14 w-full rounded-xl border-2 px-3 py-2.5 text-left text-sm leading-snug transition-all ${
                    isMatched
                      ? "border-ok/60 bg-ok/10 text-ok"
                      : isWrong
                        ? "border-bad bg-bad/10 text-bad"
                        : "border-line bg-surface-2 hover:border-neon"
                  }`}
                >
                  {r}
                </motion.button>
              );
            })}
          </div>
        </div>

        {done && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center text-sm text-ok"
          >
            全部配对完成！{mistakes === 0 ? "零失误，完美 🎯" : `共失误 ${mistakes} 次`}
          </motion.p>
        )}
        {!done && selectedLeft && (
          <p className="mt-6 text-center text-xs text-cyan">
            已选中「{selectedLeft}」—— 在右列点它对应的一项
          </p>
        )}
      </div>
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
