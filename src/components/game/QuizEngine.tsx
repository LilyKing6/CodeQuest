"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { RichText } from "./CodeInline";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { QuizLevel } from "@/content/types";
import { useGameStore, submitProgress } from "@/lib/game-store";
import { scoreQuiz } from "@/lib/scoring";

export function QuizEngine({
  level,
  nextLevelId,
  authed,
}: {
  level: QuizLevel;
  nextLevelId: string | null;
  authed: boolean;
}) {
  const questions = level.questions;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const setResult = useGameStore((s) => s.setResult);

  const question = questions[index];
  const progress = useMemo(
    () => ({ done: index, total: questions.length }),
    [index, questions.length],
  );

  function confirm() {
    if (selected === null) return;
    setRevealed(true);
  }

  async function next() {
    const answer = selected ?? -1;
    const all = [...answers, answer];
    if (index + 1 < questions.length) {
      setAnswers(all);
      setIndex(index + 1);
      setSelected(null);
      setRevealed(false);
      return;
    }
    // 最后一题 → 结算（先切结算屏，保存状态异步补充，网络挂起不阻塞 UI）
    const local = scoreQuiz(level, all);
    if (!local.passed) {
      setResult({
        passed: false,
        stars: 0,
        xp: 0,
        saveState: "error",
        level,
        nextLevelId,
        onRetry: reset,
      });
      return;
    }
    if (!authed) {
      setResult({
        passed: true,
        stars: local.stars,
        xp: local.xp,
        saveState: "not-authed",
        level,
        nextLevelId,
        onRetry: reset,
      });
      return;
    }
    setResult({
      passed: true,
      stars: local.stars,
      xp: local.xp,
      saveState: "saved", // 乐观展示，下方按实际结果修正
      level,
      nextLevelId,
      onRetry: reset,
    });
    const up = await submitProgress(level.id, { kind: "quiz", answers: all });
    if (!up.ok) {
      setResult({
        passed: true,
        stars: local.stars,
        xp: local.xp,
        saveState: "error",
        level,
        nextLevelId,
        onRetry: reset,
      });
    }
  }

  function reset() {
    setResult(null);
    setIndex(0);
    setAnswers([]);
    setSelected(null);
    setRevealed(false);
  }

  const correct = revealed && selected === question.answer;

  return (
    <div className="mx-auto max-w-2xl">
      {/* 进度 */}
      <div className="mb-6 flex items-center gap-4">
        <span className="font-mono text-sm text-ink-dim">
          {String(progress.done + 1).padStart(2, "0")}/{progress.total}
        </span>
        <ProgressBar value={progress.done} max={progress.total} className="flex-1" />
      </div>

      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        className="card p-6 sm:p-8"
      >
        <h2 className="text-lg font-bold leading-relaxed sm:text-xl">
          <RichText text={question.prompt} />
        </h2>

        <div className="mt-6 space-y-3">
          {question.options.map((opt, i) => {
            const isPicked = selected === i;
            const isAnswer = i === question.answer;
            let cls =
              "border-line bg-surface-2 hover:border-line-active hover:bg-surface-3";
            if (revealed) {
              if (isAnswer) cls = "border-ok/70 bg-ok/10 text-ok";
              else if (isPicked) cls = "border-bad/70 bg-bad/10 text-bad";
              else cls = "border-line bg-surface-2 opacity-50";
            } else if (isPicked) {
              cls = "border-neon bg-neon/10 text-ink";
            }
            return (
              <button
                key={i}
                disabled={revealed}
                onClick={() => setSelected(i)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-150 disabled:cursor-default ${cls}`}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-current/30 font-mono text-xs">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="min-w-0">
                  <RichText text={opt} />
                </span>
              </button>
            );
          })}
        </div>

        {/* 解析 */}
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 rounded-xl border px-4 py-4 text-sm leading-relaxed ${
              correct ? "border-ok/40 bg-ok/5" : "border-warn/40 bg-warn/5"
            }`}
          >
            <Badge tone={correct ? "ok" : "warn"} className="mb-2">
              {correct ? "✓ 回答正确" : "✗ 正确答案：" + String.fromCharCode(65 + question.answer)}
            </Badge>
            <p className="text-ink-dim">
              <RichText text={question.explanation} />
            </p>
          </motion.div>
        )}

        <div className="mt-6 flex justify-end">
          {!revealed ? (
            <Button onClick={confirm} disabled={selected === null}>
              确认答案
            </Button>
          ) : (
            <Button onClick={next}>
              {index + 1 < questions.length ? "下一题 →" : "查看结算 🎉"}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
