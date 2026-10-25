"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { MiniGameProps } from "./types";
import type { CpuSimConfig } from "@/content/types";
import { finishMiniGame } from "./shared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const OP_DESC: Record<string, string> = {
  LDA: "加载：累加器 ← 内存[地址]",
  ADD: "加法：累加器 ← 累加器 + 内存[地址]",
  SUB: "减法：累加器 ← 累加器 − 内存[地址]",
  STA: "存储：内存[地址] ← 累加器",
  OUT: "输出：把累加器送到输出区",
  HLT: "停机：程序结束",
};

export default function CpuSim({ level, nextLevelId, authed, onFinish }: MiniGameProps) {
  const config = level.config as CpuSimConfig;

  // 内存布局：地址 = 程序区之后放数据。这里固定 5~8 为数据区
  const dataAddr = useMemo(
    () => [5, 6, 7, 8].map((a) => ({ addr: a, value: 10 + a })), // 15,16,17,18
    [],
  );
  const memValue = (a: number) => dataAddr.find((d) => d.addr === a)?.value ?? 0;

  const [pc, setPc] = useState(0);
  const [acc, setAcc] = useState(0);
  const [outputs, setOutputs] = useState<number[]>([]);
  const [halted, setHalted] = useState(false);
  const [asked, setAsked] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);

  const instr = config.program[pc];
  const finished = pc >= config.program.length || halted;

  function step() {
    if (finished || !instr) return;
    switch (instr.op) {
      case "LDA":
        setAcc(memValue(instr.arg ?? 0));
        break;
      case "ADD":
        setAcc((a) => a + memValue(instr.arg ?? 0));
        break;
      case "SUB":
        setAcc((a) => a - memValue(instr.arg ?? 0));
        break;
      case "OUT":
        setOutputs((o) => [...o, acc]);
        break;
      case "HLT":
        setHalted(true);
        break;
    }
    if (instr.op !== "HLT") setPc(pc + 1);
    else setPc(pc + 1);
    if (instr.op === "OUT" && !halted) {
      // OUT 之后程序可能还有 HLT；不自动结束
    }
  }

  // OUT 后进入提问阶段：程序走到末尾或 HLT 后展示问题
  const programDone = pc >= config.program.length || (instr?.op === "HLT" && pc === config.program.length - 1 && halted);
  const canAsk = outputs.length > config.askOutputIndex;

  function ask() {
    setAsked(true);
  }

  function answer(v: number) {
    if (picked !== null) return;
    setPicked(v);
    // 表现分：一次答对 100，两次机会内答对 70，否则失败
    const perf = v === outputs[config.askOutputIndex] ? 100 : 40;
    setTimeout(() => {
      void finishMiniGame({ level, nextLevelId, authed, onFinish }, perf);
    }, 1200);
  }

  const options = useMemo(() => {
    if (!canAsk) return [];
    const truth = outputs[config.askOutputIndex];
    const set = new Set<number>([truth]);
    // 干扰项：接近真实值的数
    while (set.size < 4) {
      const delta = [-7, -3, 3, 5, 8, 12][Math.floor(Math.random() * 6)];
      const v = truth + delta;
      if (v !== truth) set.add(v);
    }
    return [...set].sort(() => Math.random() - 0.5);
  }, [canAsk, outputs, config.askOutputIndex]);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* CPU 状态条 */}
      <div className="card grid grid-cols-3 gap-4 p-5 text-center font-mono">
        <div>
          <p className="text-xs text-ink-faint">PC 程序计数器</p>
          <motion.p key={pc} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="mt-1 text-2xl font-black text-neon-strong">
            {pc < config.program.length ? `0${pc}` : "--"}
          </motion.p>
        </div>
        <div>
          <p className="text-xs text-ink-faint">ACC 累加器</p>
          <motion.p key={acc} initial={{ scale: 1.3, color: "#22d3ee" }} animate={{ scale: 1, color: "#67e8f9" }} className="mt-1 text-2xl font-black">
            {acc}
          </motion.p>
        </div>
        <div>
          <p className="text-xs text-ink-faint">输出区</p>
          <p className="mt-1 text-2xl font-black text-warn">
            {outputs.length ? outputs.join(", ") : "—"}
          </p>
        </div>
      </div>

      {/* 程序 + 内存 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <p className="mb-3 font-mono text-xs text-ink-faint">// 程序（指令内存区）</p>
          <ol className="space-y-1.5 font-mono text-sm">
            {config.program.map((ins, i) => (
              <li
                key={i}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                  i === pc
                    ? "animate-glow-pulse bg-neon/15 text-neon-strong"
                    : i < pc
                      ? "text-ink-faint"
                      : "text-ink-dim"
                }`}
              >
                <span className="w-5 text-right text-xs text-ink-faint">{i}</span>
                <span className="font-bold">{ins.op}</span>
                {ins.arg !== undefined && <span className="text-cyan">{ins.arg}</span>}
                {i === pc && <span className="ml-auto text-xs">← PC</span>}
              </li>
            ))}
          </ol>
          <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-xs leading-relaxed text-ink-dim">
            {instr ? OP_DESC[instr.op] : "程序已结束"}
          </p>
        </div>

        <div className="card p-5">
          <p className="mb-3 font-mono text-xs text-ink-faint">// 数据内存区</p>
          <div className="grid grid-cols-2 gap-2 font-mono text-sm">
            {dataAddr.map((d) => (
              <div key={d.addr} className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2">
                <span className="text-ink-faint">[{d.addr}]</span>
                <motion.span key={`${acc}-${d.addr}`} className="font-bold text-cyan-strong">
                  {d.value}
                </motion.span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 操作区 */}
      {!programDone ? (
        <div className="flex justify-center gap-3 pt-2">
          <Button onClick={step} disabled={finished} className="min-w-40">
            ⏭ 执行下一步
          </Button>
        </div>
      ) : canAsk && !asked ? (
        <div className="card p-6 text-center">
          <Badge tone="warn">程序执行完毕</Badge>
          <p className="mt-3 font-bold">程序输出了什么值？</p>
          <Button onClick={ask} className="mt-4">
            开始作答
          </Button>
        </div>
      ) : asked ? (
        <div className="card p-6">
          <p className="text-center font-bold">
            OUT 指令输出的值是？<span className="ml-2 text-sm text-ink-faint">（提示：沿着 ACC 的变化倒推）</span>
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {options.map((v) => {
              const truth = outputs[config.askOutputIndex];
              let cls = "border-line bg-surface-2 hover:border-neon cursor-pointer";
              if (picked !== null) {
                if (v === truth) cls = "border-ok/70 bg-ok/10 text-ok";
                else if (v === picked) cls = "border-bad/70 bg-bad/10 text-bad";
                else cls = "border-line opacity-40";
              }
              return (
                <motion.button
                  key={v}
                  whileTap={{ scale: 0.95 }}
                  disabled={picked !== null}
                  onClick={() => answer(v)}
                  className={`rounded-xl border-2 py-5 font-mono text-2xl font-black transition-all ${cls}`}
                >
                  {v}
                </motion.button>
              );
            })}
          </div>
          {picked !== null && (
            <p className="mt-4 text-center text-sm text-ink-dim">
              执行轨迹：ACC = 15 → +16 = 31 → −17 = <span className="font-mono text-ok">{outputs[config.askOutputIndex]}</span>
            </p>
          )}
        </div>
      ) : (
        <p className="pt-2 text-center text-sm text-ink-faint">
          继续执行程序，OUT 指令会把累加器的值送到输出区
        </p>
      )}
    </div>
  );
}
