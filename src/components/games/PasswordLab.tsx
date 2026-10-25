"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { MiniGameProps } from "./types";
import type { PasswordLabConfig } from "@/content/types";
import { finishMiniGame } from "./shared";
import { analyzePassword, meetsChallenge } from "./password-logic";
import { Badge } from "@/components/ui/Badge";

/**
 * 密码强度实验室：实时本地估算（熵模型，无任何网络请求），
 * 逐关达成条件（长度/字符类别/熵/破解年限）即通关。
 */
export default function PasswordLab({ level, nextLevelId, authed, onFinish }: MiniGameProps) {
  const config = level.config as PasswordLabConfig;
  const [pw, setPw] = useState("");
  const [idx, setIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [submittedThisRound, setSubmittedThisRound] = useState(false);

  const challenge = config.challenges[idx];
  const strength = useMemo(() => analyzePassword(pw), [pw]);
  const met = meetsChallenge(strength, challenge);

  function submit() {
    if (met) {
      setTimeout(() => {
        if (idx + 1 >= config.challenges.length) {
          const perf = Math.max(50, 100 - mistakes * 12);
          void finishMiniGame({ level, nextLevelId, authed, onFinish }, perf);
        } else {
          setIdx(idx + 1);
          setSubmittedThisRound(false);
          setPw("");
        }
      }, 1400);
    } else {
      setMistakes((m) => m + 1);
      setSubmittedThisRound(true);
    }
  }

  const entropyBar = Math.min(100, (strength.entropy / 100) * 100);
  const barColor =
    strength.entropy < 40 ? "bg-bad" : strength.entropy < 70 ? "bg-warn" : "bg-ok";

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge tone="cyan">
            挑战 {idx + 1} / {config.challenges.length}
          </Badge>
          <span className="font-mono text-sm">
            <span className="text-ink-faint">尝试 </span>
            <span className={mistakes > 0 ? "text-warn" : "text-ink-faint"}>{mistakes}</span>
          </span>
        </div>

        <p className="mt-4 font-medium">
          挑战目标：<span className="text-neon-strong">{challenge.name}</span>
        </p>
        <ul className="mt-2 space-y-1 text-sm text-ink-dim">
          {challenge.minLength !== undefined && (
            <li>· 长度 ≥ {challenge.minLength} 字符</li>
          )}
          {challenge.requireClasses && (
            <li>· 必须包含：{challenge.requireClasses.join(" + ")}</li>
          )}
          {challenge.minEntropy !== undefined && (
            <li>· 熵 ≥ {challenge.minEntropy} bit</li>
          )}
          {challenge.minCrackYears !== undefined && (
            <li>· 估算破解时间 ≥ {challenge.minCrackYears} 年</li>
          )}
        </ul>

        {/* 输入框 */}
        <input
          type="text"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="在这里构造你的密码（仅本地计算，不会上传）"
          autoComplete="off"
          spellCheck={false}
          className="input mt-5 font-mono text-lg tracking-wider"
        />

        {/* 实时强度面板 */}
        <div className="mt-4">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-3">
            <motion.div
              className={`h-full rounded-full ${barColor}`}
              animate={{ width: `${entropyBar}%` }}
              transition={{ type: "spring", stiffness: 160, damping: 22 }}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 font-mono text-sm sm:grid-cols-4">
            <Metric label="长度" value={String(strength.length)} />
            <Metric label="字符集" value={`${strength.charsetSize} 种`} />
            <Metric label="熵" value={`${strength.entropy} bit`} />
            <Metric
              label="破解时间"
              value={strength.crackTime}
              tone={strength.crackYears >= 100 ? "ok" : strength.crackYears >= 1 ? "warn" : "bad"}
            />
          </div>
          {strength.classes.length > 0 && (
            <p className="mt-2 text-xs text-ink-faint">
              使用字符类别：{strength.classes.join("、")}
            </p>
          )}
        </div>

        {/* 判定反馈 */}
        {submittedThisRound && !met && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-lg border border-warn/40 bg-warn/10 px-3 py-2 text-sm text-warn"
          >
            还没达标——看上面哪一条不满足？试着加长、混入不同字符类别。
          </motion.p>
        )}
        {pw.length > 0 && met && (
          <p className="mt-4 text-sm text-ok">✓ 条件已全部满足，提交！</p>
        )}

        <div className="mt-6 text-center">
          <button onClick={submit} disabled={pw.length === 0} className="btn-neon min-w-40">
            {met ? "提交，进入下一关" : "检查是否达标"}
          </button>
        </div>
      </div>

      <div className="card p-5 text-xs leading-relaxed text-ink-dim">
        <p className="mb-1 font-mono text-ink-faint">// 知识点</p>
        熵 = 长度 × log₂(字符集大小)。每加一位，破解工作量翻倍；扩大字符集则让底数变大——
        所以 <span className="text-ink">长而杂</span> 永远胜过 <span className="text-ink">短而怪</span>。
        本模型未考虑字典攻击和键盘模式（"password123!" 熵高但在字典里），真实世界请用密码管理器 + 2FA。
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  tone = "cyan",
}: {
  label: string;
  value: string;
  tone?: "cyan" | "ok" | "warn" | "bad";
}) {
  const color = { cyan: "text-cyan-strong", ok: "text-ok", warn: "text-warn", bad: "text-bad" }[tone];
  return (
    <div className="rounded-lg bg-surface-2 px-3 py-2 text-center">
      <p className={`truncate text-sm font-bold ${color}`}>{value}</p>
      <p className="mt-0.5 text-[10px] text-ink-faint">{label}</p>
    </div>
  );
}
