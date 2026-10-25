"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { MiniGameProps } from "./types";
import type { SchedulerConfig } from "@/content/types";
import { finishMiniGame } from "./shared";
import {
  simulateSchedule,
  formatAvg,
  type SchedProc,
} from "./scheduler-logic";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const COLORS = ["#8b5cf6", "#22d3ee", "#34d399", "#fbbf24", "#f472b6"];

export default function CpuScheduler({ level, nextLevelId, authed, onFinish }: MiniGameProps) {
  const config = level.config as SchedulerConfig;
  const [order, setOrder] = useState<SchedProc[]>(() => shuffle(config.processes));
  const [submitted, setSubmitted] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const result = useMemo(() => simulateSchedule(order), [order]);
  const optimal = useMemo(
    () => simulateSchedule([...config.processes].sort((a, b) => a.burst - b.burst)).avgWait,
    [config.processes],
  );

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
    setSubmitted(false);
  }

  function onDrop(target: number) {
    if (dragIdx === null || dragIdx === target) return;
    const next = [...order];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(target, 0, moved);
    setOrder(next);
    setDragIdx(null);
    setSubmitted(false);
  }

  async function check() {
    setSubmitted(true);
    // 表现分 = 最优平均等待 / 你的平均等待 × 100（达到最优=100）
    const perf = Math.min(100, Math.round((optimal / result.avgWait) * 100));
    if (result.avgWait <= optimal + 0.001) {
      await finishMiniGame({ level, nextLevelId, authed, onFinish }, 100);
    } else {
      // 未达最优不算通关，但给出反馈；连续调优后达标即可
      if (perf >= 90) {
        await finishMiniGame({ level, nextLevelId, authed, onFinish }, 90);
      }
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <Badge tone="cyan">FCFS · 先来先服务（顺序由你决定）</Badge>
          <span className="font-mono text-xs text-ink-faint">
            平均等待越低越好
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          四个进程都在 0 时刻到达，执行顺序由你安排。
          <span className="text-ink">拖动</span>或用按钮调整顺序，让
          <span className="font-mono text-neon-strong"> 平均等待时间 </span>
          最小。
        </p>

        {/* 进程列表 */}
        <ul className="mt-5 space-y-2" onDragOver={(e) => e.preventDefault()}>
          <AnimatePresence initial={false}>
            {order.map((p, i) => (
              <motion.li
                key={p.name}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                draggable
                onDragStart={() => setDragIdx(i)}
                onDragEnter={() => onDrop(i)}
                onDragEnd={() => setDragIdx(null)}
                className="flex cursor-grab items-center gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3 active:cursor-grabbing"
              >
                <span className="font-mono text-sm text-ink-faint">#{i + 1}</span>
                <span className="size-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="flex-1 font-semibold">{p.name}</span>
                <span className="font-mono text-sm text-cyan">执行 {p.burst}s</span>
                <span className="font-mono text-xs text-ink-faint">
                  等待 {result.waits[i]}s
                </span>
                <span className="flex gap-1">
                  <button onClick={() => move(i, -1)} className="rounded px-1.5 text-ink-faint hover:bg-surface-3 hover:text-ink" aria-label="上移">▲</button>
                  <button onClick={() => move(i, 1)} className="rounded px-1.5 text-ink-faint hover:bg-surface-3 hover:text-ink" aria-label="下移">▼</button>
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* 甘特图 */}
        <div className="mt-6">
          <p className="mb-2 font-mono text-xs text-ink-faint">// CPU 时间线</p>
          <div className="flex h-12 overflow-hidden rounded-xl border border-line">
            {result.timeline.map((seg, i) => (
              <motion.div
                key={seg.name + seg.start}
                layout
                className="relative grid place-items-center text-xs font-bold text-bg"
                style={{
                  width: `${(seg.end - seg.start) * 8}%`,
                  minWidth: 64,
                  background: COLORS[i % COLORS.length],
                }}
                title={`${seg.name}: ${seg.start}~${seg.end}s`}
              >
                {seg.name}（{seg.start}~{seg.end}）
              </motion.div>
            ))}
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-ink-faint">
            <span>0s</span>
            <span>
              {result.timeline.reduce((s, t) => s + (t.end - t.start), 0)}s
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-lg">
            平均等待 ={" "}
            <span
              className={
                submitted
                  ? result.avgWait <= optimal + 0.001
                    ? "text-ok"
                    : "text-warn"
                  : "text-neon-strong"
              }
            >
              {formatAvg(result.avgWait)}s
            </span>
            {submitted && result.avgWait > optimal + 0.001 && (
              <span className="ml-2 text-xs text-ink-faint">
                （理论最优 {formatAvg(optimal)}s —— 提示：短任务先跑）
              </span>
            )}
          </p>
          {!submitted || (result.avgWait > optimal + 0.001 && result.avgWait / optimal > 1.1) ? (
            <Button onClick={check} disabled={submitted && result.avgWait / optimal > 1.1}>
              {submitted ? "继续调整顺序…" : "就这么排，提交！"}
            </Button>
          ) : null}
        </div>
      </div>

      {submitted && result.avgWait > optimal + 0.001 && (
        <p className="text-center text-sm text-warn">
          还能更好：把执行时间短的进程排前面试试（SJF 短作业优先）
        </p>
      )}
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
