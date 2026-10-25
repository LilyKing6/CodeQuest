import { describe, expect, it } from "vitest";
import { simulateSchedule } from "@/components/games/scheduler-logic";
import { countInversions } from "@/components/games/sort-logic";
import { ALL_LEVELS, THEMES, findLevelWithContext, nextLevelOf } from "@/content/registry";
import type { MiniGameLevel, QuizLevel } from "@/content/types";

describe("scheduler logic", () => {
  it("SJF 顺序平均等待最优", () => {
    const procs = [
      { name: "A", burst: 8 },
      { name: "B", burst: 3 },
      { name: "C", burst: 10 },
      { name: "D", burst: 5 },
    ];
    const sjf = simulateSchedule([...procs].sort((a, b) => a.burst - b.burst));
    const fifo = simulateSchedule(procs);
    expect(sjf.avgWait).toBeLessThan(fifo.avgWait);
    // SJF: B(0) D(3) A(8) C(16) → avg = (0+3+8+16)/4 = 6.75
    expect(sjf.avgWait).toBeCloseTo(6.75);
    // FIFO: (0+8+11+21)/4 = 10
    expect(fifo.avgWait).toBeCloseTo(10);
  });

  it("时间线衔接", () => {
    const r = simulateSchedule([
      { name: "X", burst: 2 },
      { name: "Y", burst: 3 },
    ]);
    expect(r.timeline).toEqual([
      { name: "X", start: 0, end: 2 },
      { name: "Y", start: 2, end: 5 },
    ]);
  });
});

describe("sort logic", () => {
  it("逆序对个数 = 相邻交换最少次数", () => {
    expect(countInversions([1, 2, 3])).toBe(0);
    expect(countInversions([3, 2, 1])).toBe(3);
    expect(countInversions([7, 3, 9, 2, 5])).toBe(6); // 冒泡关卡 parSwaps
  });
});

describe("content integrity", () => {
  it("关卡 id 全局唯一", () => {
    const ids = ALL_LEVELS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("每题答案下标合法、选项至少 2 个", () => {
    for (const level of ALL_LEVELS) {
      if (level.type !== "quiz") continue;
      for (const q of level.questions) {
        expect(q.options.length, q.id).toBeGreaterThanOrEqual(2);
        expect(q.answer, q.id).toBeGreaterThanOrEqual(0);
        expect(q.answer, q.id).toBeLessThan(q.options.length);
        expect(q.explanation.length, q.id).toBeGreaterThan(0);
      }
    }
  });

  it("minigame 的 game id 有注册的组件（注册表里列出的所有游戏）", () => {
    const known = new Set([
      "binary-bulbs",
      "logic-gates",
      "cpu-sim",
      "cpu-scheduler",
      "tcp-handshake",
      "subnetting",
      "binary-search",
      "bubble-sort",
    ]);
    for (const level of ALL_LEVELS) {
      if (level.type === "minigame") {
        expect(known.has(level.game), level.id).toBe(true);
      }
    }
  });

  it("findLevelWithContext 与 nextLevelOf 正确", () => {
    const ctx = findLevelWithContext("cpu-1");
    expect(ctx?.theme.id).toBe("cpu");
    expect(ctx?.levelIndex).toBe(0);
    const next = nextLevelOf("cpu-1");
    expect(next?.id).toBe("cpu-2");
    // 最后一关没有下一关
    const lastTheme = THEMES[THEMES.length - 1];
    expect(nextLevelOf(lastTheme.levels[lastTheme.levels.length - 1].id)).toBeNull();
  });

  it("quiz 每关题目数在 6~10 之间", () => {
    for (const level of ALL_LEVELS) {
      if (level.type === "quiz") {
        expect(level.questions.length, level.id).toBeGreaterThanOrEqual(6);
        expect(level.questions.length, level.id).toBeLessThanOrEqual(10);
      }
    }
  });

  it("二进制灯泡目标值在 8 位范围内", () => {
    const level = ALL_LEVELS.find((l) => l.id === "binary-2") as MiniGameLevel;
    const config = level.config as import("@/content/types").BinaryBulbsConfig;
    for (const t of config.targets) {
      expect(t).toBeLessThanOrEqual(255);
      expect(t).toBeGreaterThan(0);
    }
  });
});
