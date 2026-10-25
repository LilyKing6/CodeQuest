"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { MiniGameProps } from "./types";
import type { CssBoxConfig } from "@/content/types";
import { finishMiniGame } from "./shared";
import { totalWidth, widthDiff } from "./css-box-logic";
import { Badge } from "@/components/ui/Badge";

/**
 * CSS 盒模型挑战：固定内容宽度，用滑块调 padding 与 border，
 * 让元素总宽（content + 2×padding + 2×border）命中目标值。
 */
export default function CssBox({ level, nextLevelId, authed, onFinish }: MiniGameProps) {
  const config = level.config as CssBoxConfig;
  const [targetIdx, setTargetIdx] = useState(0);
  const [padding, setPadding] = useState(0);
  const [border, setBorder] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [checkedThisRound, setCheckedThisRound] = useState(false);

  const target = config.targets[targetIdx];
  const spec = { contentWidth: config.contentWidth, padding, border };
  const current = totalWidth(spec);
  const diff = widthDiff(spec, target.total);

  function check() {
    if (diff === 0) {
      setCheckedThisRound(true);
      setTimeout(() => {
        if (targetIdx + 1 >= config.targets.length) {
          const perf = Math.max(50, 100 - mistakes * 12);
          void finishMiniGame({ level, nextLevelId, authed, onFinish }, perf);
        } else {
          setTargetIdx(targetIdx + 1);
          setPadding(0);
          setBorder(0);
          setCheckedThisRound(false);
        }
      }, 1500);
    } else {
      setMistakes((m) => m + 1);
      setCheckedThisRound(true);
      setTimeout(() => setCheckedThisRound(false), 900);
    }
  }

  const hit = diff === 0;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge tone="cyan">
            挑战 {targetIdx + 1} / {config.targets.length}
          </Badge>
          <span className="font-mono text-sm">
            <span className="text-ink-faint">失误 </span>
            <span className={mistakes > 0 ? "text-warn" : "text-ink-faint"}>{mistakes}</span>
          </span>
        </div>

        <p className="mt-4 font-medium">
          目标总宽 <span className="font-mono text-neon-strong">{target.total}px</span>
          <span className="ml-2 text-sm text-ink-faint">（{target.hint}）</span>
        </p>

        {/* 盒模型可视化 */}
        <div className="mt-5 overflow-x-auto rounded-xl bg-surface-2 p-6">
          <div className="mx-auto w-fit">
            {/* margin 层 */}
            <div className="border-2 border-dashed border-ink-faint/40 bg-surface-3/40 p-5" title="margin（占位但不计入元素宽度）">
              <p className="mb-1 font-mono text-[10px] text-ink-faint">margin（不影响宽度）</p>
              {/* border 层 */}
              <div
                className="border-solid border-cyan/70 transition-all duration-200"
                style={{ borderWidth: border, padding: padding }}
              >
                <p className="mb-1 font-mono text-[10px] text-cyan">
                  border {border}px · padding {padding}px
                </p>
                {/* content 层 */}
                <div
                  className="grid place-items-center bg-gradient-to-br from-neon/50 to-cyan/40 font-mono text-sm font-bold"
                  style={{ width: config.contentWidth, height: 64 }}
                >
                  content {config.contentWidth}px
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 滑块 */}
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="flex items-center justify-between text-sm font-medium">
              padding（左右各占其一半）
              <span className="font-mono text-cyan">{padding}px</span>
            </span>
            <input
              type="range"
              min={0}
              max={30}
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className="mt-1.5 w-full accent-[#8b5cf6]"
            />
          </label>
          <label className="block">
            <span className="flex items-center justify-between text-sm font-medium">
              border（左右各占其一半）
              <span className="font-mono text-cyan">{border}px</span>
            </span>
            <input
              type="range"
              min={0}
              max={15}
              value={border}
              onChange={(e) => setBorder(Number(e.target.value))}
              className="mt-1.5 w-full accent-[#22d3ee]"
            />
          </label>
        </div>

        {/* 实时计算 */}
        <div className="mt-5 rounded-xl bg-surface-2 px-4 py-3 font-mono text-sm">
          <span className="text-ink-dim">{config.contentWidth}</span>
          <span className="text-ink-faint"> (content) + </span>
          <span className="text-cyan">{padding}×2</span>
          <span className="text-ink-faint"> (padding) + </span>
          <span className="text-cyan">{border}×2</span>
          <span className="text-ink-faint"> (border) = </span>
          <motion.span
            key={current}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            className={`text-lg font-black ${hit ? "text-ok" : current > target.total ? "text-bad" : "text-warn"}`}
          >
            {current}px
          </motion.span>
          {!hit && checkedThisRound && (
            <span className="ml-2 font-sans text-xs text-ink-dim">
              {diff > 0 ? `超了 ${diff}px，往回调调` : `还差 ${-diff}px，继续加`}
            </span>
          )}
          {hit && <span className="ml-2 font-sans text-xs text-ok">✓ 命中目标！</span>}
        </div>

        <div className="mt-5 text-center">
          <button onClick={check} disabled={checkedThisRound && hit} className="btn-neon min-w-40">
            提交这个盒模型
          </button>
        </div>
      </div>

      <div className="card p-5 text-xs leading-relaxed text-ink-dim">
        <p className="mb-1 font-mono text-ink-faint">// 知识点</p>
        默认 <span className="font-mono text-cyan">box-sizing: content-box</span> 时，
        元素总宽 = content + 左右 padding + 左右 border。<span className="font-mono text-cyan">margin</span>
        {" "}只占布局空间、不画进元素里，所以不算总宽——这是 CSS 面试的经典陷阱题。
        设成 <span className="font-mono text-cyan">border-box</span> 后 width 直接含 padding/border，布局会好算很多。
      </div>
    </div>
  );
}
