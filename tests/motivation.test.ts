import { describe, expect, it } from "vitest";
import { MAX_LEVEL, levelTitle, xpForLevel, xpLevelInfo } from "@/lib/level-curve";
import { nextStreak, utcDateStr, yesterdayStr } from "@/lib/streak";
import { dailyLevelId, isTodayDaily } from "@/lib/daily";
import { ALL_LEVELS } from "@/content/registry";

describe("level-curve", () => {
  it("0 XP 是 Lv1", () => {
    const info = xpLevelInfo(0);
    expect(info.level).toBe(1);
    expect(info.xpToNext).toBe(100);
    expect(info.progress).toBe(0);
  });

  it("升级边界：100 XP 到 Lv2，250 XP 到 Lv3", () => {
    expect(xpLevelInfo(99).level).toBe(1);
    expect(xpLevelInfo(100).level).toBe(2);
    // Lv2→3 需要 150，累计 250
    expect(xpLevelInfo(250).level).toBe(3);
  });

  it("进度条计算", () => {
    const info = xpLevelInfo(150); // Lv2，本级已 50/150
    expect(info.level).toBe(2);
    expect(info.xpInLevel).toBe(50);
    expect(info.xpToNext).toBe(100);
    expect(info.progress).toBeCloseTo(1 / 3);
  });

  it("满级封顶", () => {
    const huge = xpForLevel(1) * 999;
    const info = xpLevelInfo(huge);
    expect(info.level).toBe(MAX_LEVEL);
    expect(info.maxed).toBe(true);
    expect(info.progress).toBe(1);
  });

  it("升级需求单调递增", () => {
    for (let l = 1; l < 10; l++) {
      expect(xpForLevel(l + 1)).toBeGreaterThan(xpForLevel(l));
    }
  });

  it("称号阶梯", () => {
    expect(levelTitle(1)).toBe("新生");
    expect(levelTitle(6)).toBe("初级开发");
    expect(levelTitle(40)).toBe("传奇架构师");
  });
});

describe("streak", () => {
  it("首次通关 → 1", () => {
    expect(nextStreak(0, null, "2026-10-25")).toBe(1);
    expect(nextStreak(5, null, "2026-10-25")).toBe(1);
  });

  it("昨天有记录 → +1", () => {
    expect(nextStreak(3, "2026-10-24", "2026-10-25")).toBe(4);
  });

  it("今天已记录 → 维持（一天多次通关不加）", () => {
    expect(nextStreak(4, "2026-10-25", "2026-10-25")).toBe(4);
  });

  it("断签超过一天 → 重置为 1", () => {
    expect(nextStreak(7, "2026-10-23", "2026-10-25")).toBe(1);
  });

  it("昨天字符串计算跨月正确", () => {
    expect(yesterdayStr("2026-11-01")).toBe("2026-10-31");
    expect(yesterdayStr("2027-01-01")).toBe("2026-12-31");
  });

  it("utcDateStr 格式", () => {
    expect(utcDateStr(new Date("2026-10-25T08:00:00Z"))).toBe("2026-10-25");
  });
});

describe("daily", () => {
  it("同一天全站同一关，跨天不同（大概率）", () => {
    const a = dailyLevelId("2026-10-25");
    expect(dailyLevelId("2026-10-25")).toBe(a);
  });

  it("返回的 id 一定存在于关卡表", () => {
    for (const date of ["2026-10-25", "2026-10-26", "2027-01-01", "2020-06-15"]) {
      const id = dailyLevelId(date);
      expect(ALL_LEVELS.some((l) => l.id === id), `${date} → ${id}`).toBe(true);
    }
  });

  it("isTodayDaily 判断", () => {
    const today = utcDateStr();
    expect(isTodayDaily(dailyLevelId(today), today)).toBe(true);
    expect(isTodayDaily("不存在的关卡", today)).toBe(false);
  });

  it("一个月内至少覆盖多个不同关卡（不是固定第一关）", () => {
    const picks = new Set<string>();
    for (let d = 1; d <= 30; d++) {
      picks.add(dailyLevelId(`2026-10-${String(d).padStart(2, "0")}`));
    }
    expect(picks.size).toBeGreaterThan(5);
  });
});
