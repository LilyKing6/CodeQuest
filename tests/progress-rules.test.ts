import { describe, expect, it } from "vitest";
import {
  isLevelUnlocked,
  isThemeUnlocked,
  nextPlayableLevel,
  isFreePlayLevel,
  type ProgressMap,
} from "@/lib/progress-rules";
import { THEMES } from "@/content/registry";

describe("progress rules", () => {
  const empty: ProgressMap = {};

  it("首主题首关默认解锁", () => {
    expect(isLevelUnlocked(empty, 0, 0)).toBe(true);
    expect(isLevelUnlocked(empty, 0, 1)).toBe(false);
  });

  it("通关第一关后第二关解锁", () => {
    const p: ProgressMap = { [THEMES[0].levels[0].id]: 1 };
    expect(isLevelUnlocked(p, 0, 1)).toBe(true);
    expect(isLevelUnlocked(p, 0, 2)).toBe(false);
  });

  it("0 星不算通关", () => {
    const p: ProgressMap = { [THEMES[0].levels[0].id]: 0 };
    expect(isLevelUnlocked(p, 0, 1)).toBe(false);
  });

  it("第二主题默认锁定，上一主题过 80% 后解锁", () => {
    const binaryLen = THEMES[0].levels.length; // 5
    const need = Math.ceil(binaryLen * 0.8); // 4
    const partial: ProgressMap = {};
    for (let i = 0; i < need - 1; i++) partial[THEMES[0].levels[i].id] = 1;
    expect(isThemeUnlocked(partial, 1)).toBe(false);
    partial[THEMES[0].levels[need - 1].id] = 1;
    expect(isThemeUnlocked(partial, 1)).toBe(true);
  });

  it("每个主题第一关免登录", () => {
    for (const t of THEMES) {
      expect(isFreePlayLevel(t.levels[0].id)).toBe(true);
      if (t.levels[1]) expect(isFreePlayLevel(t.levels[1].id)).toBe(false);
    }
  });

  it("nextPlayableLevel 指向第一个未通关关卡", () => {
    expect(nextPlayableLevel({})).toEqual({ themeIndex: 0, levelIndex: 0 });
    const p: ProgressMap = {
      [THEMES[0].levels[0].id]: 3,
      [THEMES[0].levels[1].id]: 2,
    };
    expect(nextPlayableLevel(p)).toEqual({ themeIndex: 0, levelIndex: 2 });
  });
});
