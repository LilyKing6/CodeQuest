import { ALL_LEVELS, findLevelWithContext } from "@/content/registry";
import type { Level } from "@/content/types";
import { utcDateStr } from "./streak";

/** 每日挑战当日首完成的额外 XP */
export const DAILY_BONUS_XP = 40;

/**
 * 每日挑战（纯函数，可单测）：
 * FNV-1a 哈希日期 → 从全部关卡中确定性地挑一关。
 * 全站同一天挑战同一关（Wordle 式），通关该关当日 XP 双倍。
 */
function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** 指定日期的每日挑战关卡（全站一致） */
export function dailyLevelId(dateStr: string = utcDateStr()): string {
  const idx = fnv1a(`codequest-daily-${dateStr}`) % ALL_LEVELS.length;
  return ALL_LEVELS[idx].id;
}

export function dailyLevel(dateStr: string = utcDateStr()): Level | undefined {
  const id = dailyLevelId(dateStr);
  return findLevelWithContext(id)?.level;
}

/** 该关是否是「今天」的每日挑战 */
export function isTodayDaily(levelId: string, dateStr: string = utcDateStr()): boolean {
  return levelId === dailyLevelId(dateStr);
}
