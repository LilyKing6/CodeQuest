"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { MiniGameProps } from "./types";
import type { BinarySearchConfig } from "@/content/types";
import { finishMiniGame } from "./shared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function BinarySearch({ level, nextLevelId, authed, onFinish }: MiniGameProps) {
  const config = level.config as BinarySearchConfig;
  const [lo, setLo] = useState(1);
  const [hi, setHi] = useState(config.max);
  const [guesses, setGuesses] = useState<{ value: number; hint: "high" | "low" | "hit" }[]>([]);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [input, setInput] = useState("");

  const remaining = hi - lo + 1;
  const guessesLeft = config.maxGuesses - guesses.length;

  function guess(raw: string) {
    const v = Number(raw);
    if (!Number.isInteger(v) || v < lo || v > hi || won || lost) return;
    setInput("");
    if (v === config.target) {
      setGuesses((g) => [...g, { value: v, hint: "hit" }]);
      setWon(true);
      const perf = Math.round(
        100 - (guesses.length / Math.max(1, config.maxGuesses)) * 20,
      );
      setTimeout(() => {
        void finishMiniGame({ level, nextLevelId, authed, onFinish }, Math.max(70, perf));
      }, 900);
      return;
    }
    const hint = v > config.target ? ("high" as const) : ("low" as const);
    const next = [...guesses, { value: v, hint }];
    setGuesses(next);
    if (hint === "high") setHi(v - 1);
    else setLo(v + 1);
    if (next.length >= config.maxGuesses) {
      setLost(true);
      setTimeout(() => {
        void finishMiniGame({ level, nextLevelId, authed, onFinish }, 40);
      }, 1200);
    }
  }

  const optimalGuess = Math.floor((lo + hi) / 2);
  const maxStepsNeeded = Math.ceil(Math.log2(config.max + 1));

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="card p-6 text-center">
        <Badge tone="cyan">
          1 ~ {config.max} 之间 · 二分只需 {maxStepsNeeded} 次 · 你有 {config.maxGuesses} 次机会
        </Badge>

        {/* 可视化范围条 */}
        <div className="relative mx-auto mt-6 h-14 max-w-lg overflow-hidden rounded-xl border border-line bg-surface-2">
          <div className="absolute inset-y-0 bg-surface-3" style={{ left: 0, width: "100%" }} />
          <motion.div
            animate={{ left: `${((lo - 1) / config.max) * 100}%`, width: `${(remaining / config.max) * 100}%` }}
            transition={{ type: "spring", stiffness: 160, damping: 20 }}
            className="absolute inset-y-0 bg-gradient-to-r from-neon/40 to-cyan/40"
          />
          <div className="absolute inset-0 grid place-items-center font-mono text-lg font-black">
            {won || lost ? "" : `${lo} ~ ${hi}`}
          </div>
          {won && (
            <div className="absolute inset-0 grid place-items-center bg-ok/20 font-mono text-xl font-black text-ok">
              {config.target} 找到了！
            </div>
          )}
        </div>

        {/* 输入 */}
        {!won && !lost && (
          <form
            className="mx-auto mt-6 flex max-w-sm gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              guess(input);
            }}
          >
            <input
              className="input font-mono text-center text-xl"
              inputMode="numeric"
              pattern="[0-9]*"
              value={input}
              onChange={(e) => setInput(e.target.value.replace(/\D/g, ""))}
              placeholder={`${lo} ~ ${hi}`}
              autoFocus
            />
            <Button type="submit" disabled={!input}>
              猜
            </Button>
          </form>
        )}

        <p className="mt-3 font-mono text-xs text-ink-faint">
          剩余机会 {guessesLeft} · 范围内剩 {remaining} 个数
          {!won && !lost && remaining > 1 && ` · 最优策略：猜 ${optimalGuess}`}
        </p>
        {lost && (
          <p className="mt-3 font-mono text-lg text-bad">
            机会用完了，答案是 {config.target}
          </p>
        )}
      </div>

      {/* 猜测历史 */}
      {guesses.length > 0 && (
        <div className="card p-5">
          <p className="mb-3 font-mono text-xs text-ink-faint">// 猜测历史</p>
          <div className="flex flex-wrap justify-center gap-2">
            {guesses.map((g, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`rounded-lg border px-3.5 py-2 font-mono text-lg font-bold ${
                  g.hint === "hit"
                    ? "border-ok bg-ok/15 text-ok"
                    : g.hint === "high"
                      ? "border-warn/50 bg-warn/10 text-warn"
                      : "border-cyan/50 bg-cyan/10 text-cyan-strong"
                }`}
                title={g.hint === "high" ? "太大了 ↓" : g.hint === "low" ? "太小了 ↑" : "正确！"}
              >
                {g.value}
                <span className="ml-1 text-xs">
                  {g.hint === "high" ? "↓大" : g.hint === "low" ? "↑小" : "🎯"}
                </span>
              </motion.span>
            ))}
          </div>
          {guesses.length >= 2 && !won && (
            <p className="mt-4 text-center text-xs leading-relaxed text-ink-dim">
              注意每次猜测都把范围砍半：100 → 50 → 25 → 12 ……
              这就是 <span className="font-mono text-cyan">O(log n)</span> 的力量
            </p>
          )}
        </div>
      )}
    </div>
  );
}
