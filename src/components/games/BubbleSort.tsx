"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { MiniGameProps } from "./types";
import type { BubbleSortConfig } from "@/content/types";
import { finishMiniGame } from "./shared";
import { countInversions } from "./sort-logic";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function BubbleSort({ level, nextLevelId, authed, onFinish }: MiniGameProps) {
  const config = level.config as BubbleSortConfig;
  const [nums, setNums] = useState<number[]>(() => [...config.numbers]);
  const [swaps, setSwaps] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const inversions = useMemo(() => countInversions(config.numbers), [config.numbers]);
  const isSorted = useMemo(
    () => nums.every((v, i) => i === 0 || v >= nums[i - 1]),
    [nums],
  );

  function swap(i: number) {
    if (isSorted && nums.every((v, k) => k === 0 || v >= nums[k - 1])) return;
    const j = i + 1;
    const next = [...nums];
    [next[i], next[j]] = [next[j], next[i]];
    setNums(next);
    setSwaps((s) => s + 1);
    setSelected(null);
    const nowSorted = next.every((v, k) => k === 0 || v >= next[k - 1]);
    if (nowSorted) {
      setDone(true);
      const perf = swaps + 1 <= config.parSwaps ? 100 : Math.max(60, 100 - (swaps + 1 - config.parSwaps) * 5);
      setTimeout(() => {
        void finishMiniGame({ level, nextLevelId, authed, onFinish }, perf);
      }, 1000);
    }
  }

  function reset() {
    setNums([...config.numbers]);
    setSwaps(0);
    setSelected(null);
    setDone(false);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge tone="cyan">
            目标：升序 · 只能交换相邻两数
          </Badge>
          <div className="font-mono text-sm">
            <span className={swaps <= config.parSwaps ? "text-ok" : "text-warn"}>
              交换 {swaps}
            </span>
            <span className="text-ink-faint"> / 最少 {config.parSwaps}</span>
          </div>
        </div>

        {/* 数字块 */}
        <div className="mt-8 flex items-end justify-center gap-2 sm:gap-3">
          <AnimatePresence>
            {nums.map((v, i) => (
              <motion.button
                key={v}
                layout
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                onClick={() => {
                  if (selected === null) setSelected(i);
                  else if (selected === i) setSelected(null);
                  else if (selected + 1 === i || selected - 1 === i) swap(Math.min(selected, i));
                  else setSelected(i);
                }}
                className={`relative grid place-items-center rounded-xl border-2 font-mono font-black transition-colors ${
                  selected === i
                    ? "border-neon bg-neon/15 text-neon-strong"
                    : "border-line bg-surface-2 text-ink hover:border-line-active"
                }`}
                style={{ width: 64, height: 64 + v * 6 }}
              >
                <span className="absolute inset-x-0 bottom-0 rounded-b-lg bg-gradient-to-t from-neon/25 to-transparent" style={{ height: v * 6 }} />
                <span className="text-xl sm:text-2xl">{v}</span>
                {/* 相邻提示 */}
                {selected !== null && Math.abs(selected - i) === 1 && (
                  <span className="absolute -top-6 text-xs text-cyan">可交换</span>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <p className="mt-8 text-center text-xs text-ink-faint">
          点一个数，再点它相邻的数即完成交换（也可以直接点两个相邻数）
        </p>

        {/* 状态 */}
        {done ? (
          <p className="mt-6 text-center text-sm text-ok">
            排序完成，用了 {swaps} 次交换
            {swaps <= config.parSwaps
              ? `（≤ 最少次数 ${config.parSwaps}，完美！）`
              : `。理论最少是 ${config.parSwaps}——那就是「逆序对」的个数！`}
          </p>
        ) : isSorted ? (
          <p className="mt-6 text-center text-sm text-ok">已经有序 ✓</p>
        ) : (
          <div className="mt-6 text-center">
            <Button variant="ghost" onClick={reset}>
              重来 ↺
            </Button>
          </div>
        )}
      </div>

      <div className="card p-5 text-xs leading-relaxed text-ink-dim">
        <p className="mb-1 font-mono text-ink-faint">// 知识点</p>
        冒泡排序每交换一次恰好消除一个「逆序对」（前大后小的组合），所以
        最少交换次数 = 逆序对个数 = <span className="font-mono text-cyan">{inversions}</span>。
        冒泡排序整体是 <span className="font-mono text-cyan">O(n²)</span>，
        而计算逆序对本身却可以用归并排序做到 O(n log n)。
      </div>
    </div>
  );
}
