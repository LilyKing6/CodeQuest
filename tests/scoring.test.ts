import { describe, expect, it } from "vitest";
import { scoreQuiz, scoreMiniGame } from "@/lib/scoring";
import type { QuizLevel } from "@/content/types";

const level: QuizLevel = {
  id: "t",
  type: "quiz",
  title: "T",
  intro: "",
  questions: [
    { id: "q1", prompt: "p", options: ["a", "b", "c"], answer: 0, explanation: "" },
    { id: "q2", prompt: "p", options: ["a", "b", "c"], answer: 1, explanation: "" },
    { id: "q3", prompt: "p", options: ["a", "b", "c"], answer: 2, explanation: "" },
    { id: "q4", prompt: "p", options: ["a", "b", "c"], answer: 0, explanation: "" },
    { id: "q5", prompt: "p", options: ["a", "b", "c"], answer: 1, explanation: "" },
    { id: "q6", prompt: "p", options: ["a", "b", "c"], answer: 2, explanation: "" },
  ],
};

describe("scoreQuiz", () => {
  it("全对 → 3 星", () => {
    const r = scoreQuiz(level, [0, 1, 2, 0, 1, 2]);
    expect(r.passed).toBe(true);
    expect(r.stars).toBe(3);
    expect(r.xp).toBe(6 * 5 + 3 * 10);
  });

  it("档位边界：90% → 3 星，83% → 2 星，67% → 1 星", () => {
    // 6/6 = 100%
    expect(scoreQuiz(level, [0, 1, 2, 0, 1, 2]).stars).toBe(3);
    // 5/6 ≈ 83% → 2 星
    expect(scoreQuiz(level, [0, 1, 2, 0, 1, 0]).stars).toBe(2);
    // 4/6 ≈ 67% → 1 星
    expect(scoreQuiz(level, [0, 1, 2, 0, 0, 0]).stars).toBe(1);
  });

  it("低于 60% 不通过", () => {
    const r = scoreQuiz(level, [0, 0, 0, 1, 1, 1]);
    expect(r.passed).toBe(false);
    expect(r.stars).toBe(0);
    expect(r.xp).toBe(0);
  });

  it("答案数组越界安全", () => {
    const r = scoreQuiz(level, [0, 1, 2, 0, 1, 2, 0, 0, 0]);
    expect(r.stars).toBe(3);
  });
});

describe("scoreMiniGame", () => {
  const game = {
    id: "g",
    type: "minigame" as const,
    title: "G",
    intro: "",
    game: "binary-search" as const,
    config: { max: 100, target: 73, maxGuesses: 7 },
  };

  it("表现分转星档", () => {
    expect(scoreMiniGame(game, 100).stars).toBe(3);
    expect(scoreMiniGame(game, 90).stars).toBe(3);
    expect(scoreMiniGame(game, 75).stars).toBe(2);
    expect(scoreMiniGame(game, 50).stars).toBe(1);
  });

  it("低于 50 不通过", () => {
    expect(scoreMiniGame(game, 49).passed).toBe(false);
  });

  it("分数被钳制在 0~100", () => {
    expect(scoreMiniGame(game, 150).stars).toBe(3);
    expect(scoreMiniGame(game, -5).passed).toBe(false);
  });
});
