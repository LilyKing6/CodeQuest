/**
 * 连续学习 streak 推进规则（纯函数，可单测）。
 * 日期一律用 UTC 的 YYYY-MM-DD 字符串，避免时区与序列化问题。
 */

export function utcDateStr(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/** 昨天的 UTC 日期字符串 */
export function yesterdayStr(today: string): string {
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * 计算通关后新的 streak：
 * - 今天已记录过 → 维持不变（一天多次通关不加）
 * - 昨天有记录 → +1
 * - 更早/从未 → 重置为 1
 */
export function nextStreak(
  prevStreak: number,
  lastPlayedDate: string | null,
  today: string,
): number {
  if (lastPlayedDate === today) return Math.max(1, prevStreak);
  if (lastPlayedDate === yesterdayStr(today)) return prevStreak + 1;
  return 1;
}
