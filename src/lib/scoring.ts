import type { Level, MiniGameLevel, QuizLevel } from "@/content/types";

/**
 * 服务端权威计分：客户端只提交原始作答/游戏指标，
 * 星星与 XP 由这里（或这里的纯函数）计算，防止排行榜作弊。
 */

export const PASS_ACCURACY = 0.6;

/** 答题关卡：由正确数评星 */
export function scoreQuiz(level: QuizLevel, answers: number[]): {
  passed: boolean;
  stars: 0 | 1 | 2 | 3;
  xp: number;
} {
  const valid = answers.slice(0, level.questions.length);
  const correct = level.questions.reduce(
    (n, q, i) => n + (valid[i] === q.answer ? 1 : 0),
    0,
  );
  const total = level.questions.length;
  const accuracy = total === 0 ? 0 : correct / total;
  if (accuracy < PASS_ACCURACY) return { passed: false, stars: 0, xp: 0 };
  const stars: 0 | 1 | 2 | 3 =
    accuracy >= 0.9 ? 3 : accuracy >= 0.75 ? 2 : 1;
  const xp = correct * 5 + stars * 10;
  return { passed: true, stars, xp };
}

/** 小游戏：各游戏把玩法结果折算成 0~100 的表现分，再统一评星 */
export function scoreMiniGame(game: MiniGameLevel, performance: number): {
  passed: boolean;
  stars: 0 | 1 | 2 | 3;
  xp: number;
} {
  const p = Math.max(0, Math.min(100, Math.round(performance)));
  if (p < 50) return { passed: false, stars: 0, xp: 0 };
  const stars: 0 | 1 | 2 | 3 = p >= 90 ? 3 : p >= 75 ? 2 : 1;
  const xp = 15 + stars * 10;
  return { passed: true, stars, xp };
}

export function scoreLevel(
  level: Level,
  submission: { kind: "quiz"; answers: number[] } | { kind: "minigame"; performance: number },
) {
  if (level.type === "quiz" && submission.kind === "quiz") {
    return scoreQuiz(level, submission.answers);
  }
  if (level.type === "minigame" && submission.kind === "minigame") {
    return scoreMiniGame(level, submission.performance);
  }
  return { passed: false, stars: 0 as const, xp: 0 };
}
