"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { MiniGameProps } from "./types";
import type { LogicGatesConfig } from "@/content/types";
import { finishMiniGame } from "./shared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const GATE_INFO: Record<string, { desc: string; hint: string }> = {
  AND: { desc: "两个输入都是 1 才输出 1", hint: "「并且」——全部满足" },
  OR: { desc: "任一输入是 1 就输出 1", hint: "「或者」——至少一个" },
  NOT: { desc: "输入取反：1→0，0→1", hint: "「非」——唱反调" },
  XOR: { desc: "输入不同输出 1，相同输出 0", hint: "「异或」——不一样才响" },
};

export default function LogicGates({ level, nextLevelId, authed, onFinish }: MiniGameProps) {
  const config = level.config as LogicGatesConfig;
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<0 | 1 | null>(null);
  const [right, setRight] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const puzzle = config.puzzles[idx];
  const info = GATE_INFO[puzzle.gate];

  function choose(v: 0 | 1) {
    if (revealed) return;
    setPicked(v);
    setRevealed(true);
    const isRight = v === puzzle.answer;
    const newRight = right + (isRight ? 1 : 0);
    setRight(newRight);
    setTimeout(() => {
      if (idx + 1 >= config.puzzles.length) {
        void finishMiniGame({ level, nextLevelId, authed, onFinish }, newRight * 10);
      } else {
        setIdx(idx + 1);
        setPicked(null);
        setRevealed(false);
      }
    }, 1400);
  }

  const isRight = picked === puzzle.answer;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="card p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <Badge tone="cyan">
            第 {idx + 1} / {config.puzzles.length} 题
          </Badge>
          <span className="font-mono text-sm text-ok">✓ {right}</span>
        </div>

        {/* 门电路可视化 */}
        <div className="mt-6 rounded-xl border border-line bg-surface-2 p-6">
          <GateDiagram gate={puzzle.gate} inputs={puzzle.inputs} output={revealed ? puzzle.answer : null} />
        </div>

        <p className="mt-4 text-center font-mono text-sm text-ink-dim">
          {puzzle.gate} 门 · {info.desc}
          <span className="ml-2 text-ink-faint">（{info.hint}）</span>
        </p>

        {/* 输出选择 */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          {([0, 1] as const).map((v) => {
            let cls = "border-line bg-surface-2 hover:border-neon hover:bg-neon/10";
            if (revealed) {
              if (v === puzzle.answer) cls = "border-ok/70 bg-ok/10 text-ok";
              else if (v === picked) cls = "border-bad/70 bg-bad/10 text-bad";
              else cls = "border-line bg-surface-2 opacity-40";
            } else {
              cls = "border-line bg-surface-2 hover:border-neon hover:bg-neon/10 cursor-pointer";
            }
            return (
              <motion.button
                key={v}
                whileTap={{ scale: 0.96 }}
                onClick={() => choose(v)}
                disabled={revealed}
                className={`rounded-xl border-2 py-6 text-center font-mono text-4xl font-black transition-all ${cls}`}
              >
                {v}
              </motion.button>
            );
          })}
        </div>

        {revealed && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 text-center text-sm ${isRight ? "text-ok" : "text-bad"}`}
          >
            {isRight
              ? "✓ 正确！"
              : `✗ 正确输出是 ${puzzle.answer}（${puzzle.gate}：${info.hint}）`}
          </motion.p>
        )}

        {mistakeStreakIdx(idx, picked, puzzle.answer) && (
          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={() => window.location.reload()}>
              状态乱了？重置
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function mistakeStreakIdx(idx: number, picked: 0 | 1 | null, answer: 0 | 1): boolean {
  return false; // 占位：本游戏失误自动流转，无需手动重置
}

/** 门电路示意图（SVG） */
function GateDiagram({
  gate,
  inputs,
  output,
}: {
  gate: string;
  inputs: (0 | 1)[];
  output: 0 | 1 | null;
}) {
  const wireColor = (v: 0 | 1) => (v ? "#fbbf24" : "#43436a");
  return (
    <svg viewBox="0 0 320 150" className="mx-auto h-40 w-full max-w-md">
      {/* 输入线 */}
      {inputs.map((v, i) => {
        const y = inputs.length === 1 ? 75 : 50 + i * 50;
        return (
          <g key={i}>
            <text x={8} y={y + 5} fill={wireColor(v)} fontSize="20" fontFamily="monospace" fontWeight="bold">
              {v}
            </text>
            <line x1={28} y1={y} x2={110} y2={y} stroke={wireColor(v)} strokeWidth={3} />
          </g>
        );
      })}

      {/* 门体 */}
      <GateShape gate={gate} />

      {/* 输出线 */}
      <line
        x1={215}
        y1={75}
        x2={280}
        y2={75}
        stroke={output === null ? "#43436a" : wireColor(output)}
        strokeWidth={3}
        strokeDasharray={output === null ? "6 4" : undefined}
      />
      <text
        x={290}
        y={82}
        fill={output === null ? "#62627d" : wireColor(output)}
        fontSize="24"
        fontFamily="monospace"
        fontWeight="bold"
      >
        {output === null ? "?" : output}
      </text>
    </svg>
  );
}

function GateShape({ gate }: { gate: string }) {
  const stroke = "#a78bfa";
  if (gate === "NOT") {
    return (
      <g>
        <motion.path
          d="M110 35 L110 115 L185 75 Z"
          fill="#1a1a28"
          stroke={stroke}
          strokeWidth={3}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        />
        <circle cx={196} cy={75} r={9} fill="#1a1a28" stroke={stroke} strokeWidth={3} />
        <text x={132} y={82} fill={stroke} fontSize="18" fontFamily="monospace" fontWeight="bold">
          NOT
        </text>
      </g>
    );
  }
  const isAnd = gate === "AND";
  return (
    <g>
      {isAnd ? (
        <motion.path
          d="M110 40 L160 40 A35 35 0 0 1 160 110 L110 110 Z"
          fill="#1a1a28"
          stroke={stroke}
          strokeWidth={3}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        />
      ) : (
        <motion.path
          d="M110 40 Q185 40 210 75 Q185 110 110 110 Q135 75 110 40 Z"
          fill="#1a1a28"
          stroke={stroke}
          strokeWidth={3}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        />
      )}
      {gate === "XOR" && (
        <path
          d="M100 40 Q125 75 100 110"
          fill="none"
          stroke={stroke}
          strokeWidth={3}
        />
      )}
      <text
        x={gate === "XOR" ? 145 : 135}
        y={82}
        fill={stroke}
        fontSize="17"
        fontFamily="monospace"
        fontWeight="bold"
      >
        {gate}
      </text>
    </g>
  );
}
