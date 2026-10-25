"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { MiniGameProps } from "./types";
import { finishMiniGame } from "./shared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function BinaryBulbs({ level, nextLevelId, authed, onFinish }: MiniGameProps) {
  const config = level.config as { bits?: number; targets: number[]; maxMistakes?: number };
  const bits = config.bits ?? 8;
  const maxMistakes = config.maxMistakes ?? 3;

  const [targetIdx, setTargetIdx] = useState(0);
  const [state, setState] = useState<number>(0); // 位掩码
  const [mistakes, setMistakes] = useState(0);
  const [solved, setSolved] = useState<number[]>([]);
  const [wrongFlash, setWrongFlash] = useState(false);

  const target = config.targets[targetIdx];
  const current = useMemo(() => state, [state]);
  const binaryStr = current.toString(2).padStart(bits, "0");
  const targetStr = target.toString(2).padStart(bits, "0");

  function toggle(i: number) {
    const bitMask = 1 << (bits - 1 - i);
    const turningOn = (current & bitMask) === 0;
    const next = current ^ bitMask;
    setState(next);
    if (next === target) {
      const newSolved = [...solved, target];
      setSolved(newSolved);
      if (targetIdx + 1 >= config.targets.length) {
        // 全部完成：表现分 = 满分 − 每次失误扣 10
        const perf = Math.max(50, 100 - mistakes * 10);
        void finishMiniGame({ level, nextLevelId, authed, onFinish }, perf);
      } else {
        setTimeout(() => setTargetIdx(targetIdx + 1), 450);
      }
    } else if (
      turningOn &&
      popcount(next) === popcount(target)
    ) {
      // 公平失误规则：只有"点亮一位后恰好凑成同样位数的错误组合"才算失误；
      // 熄灭修正（turningOn=false）永远不算，允许玩家自由回退调整
      setMistakes((m) => m + 1);
      setWrongFlash(true);
      setTimeout(() => setWrongFlash(false), 450);
      if (mistakes + 1 >= maxMistakes) {
        void finishMiniGame({ level, nextLevelId, authed, onFinish }, 40);
      }
    }
  }

  const finished = solved.length === config.targets.length;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card p-6 sm:p-8">
        {/* 目标区 */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge tone="cyan">
              目标 {targetIdx + 1} / {config.targets.length}
            </Badge>
            <p className="mt-3 font-mono text-3xl font-black text-neon-strong" data-target={target}>
              {target}
              <span className="ml-3 text-base font-normal text-ink-dim">
                = {targetStr}₂
              </span>
            </p>
          </div>
          <div className="text-right font-mono text-sm">
            <p className="text-ink-faint">失误</p>
            <p className={wrongFlash ? "text-bad" : "text-ink-dim"}>
              {"✗".repeat(mistakes)}
              {"·".repeat(Math.max(0, maxMistakes - mistakes))}
            </p>
          </div>
        </div>

        {/* 灯泡行 */}
        <motion.div
          animate={wrongFlash ? { x: [0, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3"
          role="group"
          aria-label="二进制位开关"
        >
          {Array.from({ length: bits }, (_, i) => {
            const bit = (current >> (bits - 1 - i)) & 1;
            const weight = 1 << (bits - 1 - i);
            return (
              <button
                key={i}
                onClick={() => toggle(i)}
                className="group flex flex-col items-center gap-2 outline-none"
                aria-pressed={bit === 1}
                aria-label={`第 ${bits - i} 位，权重 ${weight}`}
              >
                {/* 灯泡 */}
                <span
                  className={`grid size-11 place-items-center rounded-xl border text-lg transition-all duration-200 sm:size-14 sm:text-2xl ${
                    bit
                      ? "animate-glow-pulse border-warn/60 bg-gradient-to-b from-warn/90 to-xp text-bg shadow-[0_0_24px_rgba(251,191,36,0.5)]"
                      : "border-line bg-surface-2 text-ink-faint group-hover:border-line-active"
                  }`}
                >
                  {bit ? "💡" : "⚫"}
                </span>
                <span className="font-mono text-[10px] text-ink-faint sm:text-xs">
                  {weight}
                </span>
                <span
                  className={`font-mono text-lg font-bold ${bit ? "text-warn" : "text-ink-faint"}`}
                >
                  {bit}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* 当前值 */}
        <div className="mt-8 text-center">
          <p className="font-mono text-2xl">
            当前 ={" "}
            <span className={current === target ? "text-ok" : "text-cyan-strong"}>
              {current}
            </span>
            <span className="ml-2 text-sm text-ink-faint">（{binaryStr}₂）</span>
          </p>
          <p className="mt-2 text-xs text-ink-faint">
            点灯泡切换开关 · 每个灯泡的权重标在下方 · 权重相加就是当前值
          </p>
        </div>

        {mistakes >= maxMistakes && (
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => {
                setMistakes(0);
                setState(0);
              }}
            >
              失误太多，重置本关 ↺
            </Button>
          </div>
        )}
      </div>

      {/* 进度点 */}
      <div className="mt-4 flex justify-center gap-2">
        {config.targets.map((t, i) => (
          <span
            key={t}
            className={`size-2.5 rounded-full transition-colors ${
              solved.includes(t) ? "bg-ok" : i === targetIdx ? "bg-neon" : "bg-surface-3"
            }`}
          />
        ))}
      </div>
      {finished && (
        <p className="mt-3 text-center text-sm text-ok">
          全部点亮！你已经是二进制原住民 🎉
        </p>
      )}
    </div>
  );
}

function popcount(n: number): number {
  let c = 0;
  while (n) {
    n &= n - 1;
    c++;
  }
  return c;
}
