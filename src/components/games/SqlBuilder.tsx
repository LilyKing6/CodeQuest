"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { MiniGameProps } from "./types";
import type { SqlBuilderConfig } from "@/content/types";
import { finishMiniGame } from "./shared";
import { Badge } from "@/components/ui/Badge";

/**
 * SQL 查询拼装：给出自然语言查询目标，把乱序子句按正确顺序点亮。
 * 装配过程实时拼接展示，答错整题重试（记一次失误）。
 */
export default function SqlBuilder({ level, nextLevelId, authed, onFinish }: MiniGameProps) {
  const config = level.config as SqlBuilderConfig;
  const [idx, setIdx] = useState(0);
  const [built, setBuilt] = useState<number[]>([]); // 已选片段下标（按选择顺序）
  const [mistakes, setMistakes] = useState(0);
  const [wrongFlash, setWrongFlash] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const puzzle = config.puzzles[idx];
  // 剩余（未使用）片段的展示顺序：保持 fragments 原序（已打乱）
  const remaining = useMemo(
    () => puzzle.fragments.map((_, i) => i).filter((i) => !built.includes(i)),
    [puzzle, built],
  );

  function pick(fragmentIdx: number) {
    if (showResult) return;
    const expected = puzzle.answer[built.length];
    if (fragmentIdx === expected) {
      const next = [...built, fragmentIdx];
      setBuilt(next);
      if (next.length === puzzle.answer.length) {
        // 拼装完成
        setShowResult(true);
        setTimeout(() => {
          if (idx + 1 >= config.puzzles.length) {
            const perf = Math.max(50, 100 - mistakes * 12);
            void finishMiniGame({ level, nextLevelId, authed, onFinish }, perf);
          } else {
            setIdx(idx + 1);
            setBuilt([]);
            setShowResult(false);
          }
        }, 2200);
      }
    } else {
      setMistakes((m) => m + 1);
      setWrongFlash(fragmentIdx);
      setTimeout(() => setWrongFlash(null), 550);
    }
  }

  const builtSql = built.map((i) => puzzle.fragments[i]).join(" ");

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge tone="cyan">
            拼装 {idx + 1} / {config.puzzles.length}
          </Badge>
          <span className="font-mono text-sm">
            <span className="text-ink-faint">失误 </span>
            <span className={mistakes > 0 ? "text-warn" : "text-ink-faint"}>{mistakes}</span>
          </span>
        </div>

        {/* 查询目标 */}
        <div className="mt-5 rounded-xl border border-line bg-surface-2 p-4">
          <p className="text-xs text-ink-faint">查询目标</p>
          <p className="mt-1 font-medium">{puzzle.goal}</p>
        </div>

        {/* 装配区 */}
        <div
          className={`mt-4 min-h-24 rounded-xl border-2 border-dashed p-4 font-mono text-sm leading-relaxed transition-colors ${
            showResult ? "border-ok/60 bg-ok/5" : "border-line bg-surface"
          }`}
        >
          <p className="mb-2 font-sans text-xs text-ink-faint">已装配的 SQL</p>
          {builtSql ? (
            <p className="text-cyan-strong">{builtSql}{showResult ? " ;" : " _"}</p>
          ) : (
            <p className="font-sans text-ink-faint">点击下方片段开始装配…</p>
          )}
          {showResult && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 font-sans text-xs text-ok"
            >
              ✓ 正确！注意子句的书写顺序：SELECT → FROM → WHERE → ORDER BY → LIMIT
            </motion.p>
          )}
        </div>

        {/* 片段池 */}
        <div className="mt-5 flex flex-wrap gap-2">
          {remaining.map((i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.96 }}
              animate={wrongFlash === i ? { x: [0, -7, 7, -4, 4, 0] } : {}}
              transition={{ duration: 0.45 }}
              disabled={showResult}
              onClick={() => pick(i)}
              className={`rounded-lg border px-3.5 py-2 font-mono text-sm transition-all ${
                wrongFlash === i
                  ? "border-bad bg-bad/10 text-bad"
                  : "border-line bg-surface-2 hover:border-neon hover:bg-neon/10"
              }`}
            >
              {puzzle.fragments[i]}
            </motion.button>
          ))}
          {remaining.length === 0 && (
            <p className="text-sm text-ink-faint">（片段已用完）</p>
          )}
        </div>

        <p className="mt-5 text-xs leading-relaxed text-ink-faint">
          提示：SQL 子句有固定书写顺序——先取哪些列（SELECT），从哪张表（FROM），筛什么条件（WHERE），
          怎么排序（ORDER BY），取几行（LIMIT）。
        </p>
      </div>
    </div>
  );
}
