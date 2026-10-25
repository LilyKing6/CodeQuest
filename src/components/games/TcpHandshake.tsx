"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { MiniGameProps } from "./types";
import type { TcpHandshakeConfig } from "@/content/types";
import { finishMiniGame } from "./shared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function TcpHandshake({ level, nextLevelId, authed, onFinish }: MiniGameProps) {
  const config = level.config as TcpHandshakeConfig;
  const shuffled = useMemo(() => shuffle(config.steps), [config.steps]);
  const [doneSteps, setDoneSteps] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const complete = doneSteps.length === config.steps.length;

  function pick(step: string) {
    if (complete) return;
    const expected = config.steps[doneSteps.length];
    if (step === expected) {
      setDoneSteps([...doneSteps, step]);
      setWrong(null);
      if (doneSteps.length + 1 === config.steps.length) {
        const perf = Math.max(50, 100 - mistakes * 12);
        setTimeout(() => {
          void finishMiniGame({ level, nextLevelId, authed, onFinish }, perf);
        }, 900);
      }
    } else {
      setWrong(step);
      setMistakes((m) => m + 1);
      setTimeout(() => setWrong(null), 700);
    }
  }

  function reset() {
    setDoneSteps([]);
    setMistakes(0);
    setWrong(null);
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* 消息序列图 */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <Badge tone="cyan">消息序列图 · Sequence Diagram</Badge>
          <span className="font-mono text-xs text-ink-faint">
            失误 {mistakes}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <p className="text-center font-mono text-sm font-bold text-cyan-strong">客户端 💻</p>
          <p className="text-center text-xs text-ink-faint">———— 网络 ————</p>
          <p className="text-center font-mono text-sm font-bold text-neon-strong">服务器 🖥️</p>
        </div>

        <div className="relative mt-2 min-h-64 space-y-4">
          {/* 两条生命线 */}
          <div className="pointer-events-none absolute inset-y-0 left-[16.66%] w-px bg-line" />
          <div className="pointer-events-none absolute inset-y-0 right-[16.66%] w-px bg-line" />

          <AnimatePresence>
            {doneSteps.map((s, i) => {
              const toServer = i !== 1; // SYN+ACK 由服务器发出，其余从客户端发出
              const isFinal = i === config.steps.length - 1;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative flex items-center py-1"
                >
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`absolute h-0.5 w-[66.6%] ${isFinal ? "bg-ok" : "bg-neon"}`}
                    style={{
                      left: toServer ? "16.66%" : undefined,
                      right: toServer ? undefined : "16.66%",
                    }}
                  />
                  <span
                    className="absolute text-sm text-neon"
                    style={{ [toServer ? "left" : "right"]: "13.5%" }}
                  >
                    {toServer ? "▶" : "◀"}
                  </span>
                  <span
                    className={`mx-auto rounded-lg border px-3 py-1.5 text-center font-mono text-[11px] leading-snug sm:text-xs ${
                      isFinal ? "border-ok/50 bg-ok/10 text-ok" : "border-neon/40 bg-neon/10 text-neon-soft"
                    }`}
                  >
                    {s}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* 步骤池 */}
      <div className="card mt-4 p-5">
        <p className="mb-3 text-sm font-medium">
          {complete ? "🎉 握手完成，连接已建立！" : "按正确顺序点击下方步骤，完成三次握手："}
        </p>
        <div className="space-y-2">
          {shuffled.map((s) => {
            const used = doneSteps.includes(s);
            const isWrong = wrong === s;
            return (
              <motion.button
                key={s}
                whileTap={{ scale: 0.98 }}
                animate={isWrong ? { x: [0, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                disabled={used || complete}
                onClick={() => pick(s)}
                className={`w-full rounded-xl border px-4 py-3 text-left font-mono text-xs leading-relaxed transition-all sm:text-sm ${
                  used
                    ? "border-ok/40 bg-ok/5 text-ink-faint line-through"
                    : isWrong
                      ? "border-bad bg-bad/10 text-bad"
                      : "border-line bg-surface-2 hover:border-neon hover:bg-neon/5"
                }`}
              >
                {s}
              </motion.button>
            );
          })}
        </div>
        {mistakes >= 3 && !complete && (
          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={reset}>
              失误有点多，重头再来 ↺
            </Button>
          </div>
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
