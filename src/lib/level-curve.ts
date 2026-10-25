/**
 * XP 等级曲线（纯函数，可单测）。
 * 从 Lv L 升到 L+1 需要 100 + (L-1)×50 XP：Lv1→2 要 100，Lv2→3 要 150 ……
 * 上限 MAX_LEVEL（之后 XP 仍累计，等级封顶）。
 */

export const MAX_LEVEL = 50;

/** 从 Lv L 升到 L+1 所需 XP */
export function xpForLevel(level: number): number {
  return 100 + (level - 1) * 50;
}

export interface LevelInfo {
  level: number;
  /** 当前等级内已积累的 XP */
  xpInLevel: number;
  /** 升到下一级还差多少 XP（满级为 0） */
  xpToNext: number;
  /** 升到下一级所需总量（进度条分母；满级为 1 避免 0/0） */
  xpNeeded: number;
  /** 0~1 进度 */
  progress: number;
  maxed: boolean;
}

export function xpLevelInfo(totalXp: number): LevelInfo {
  let level = 1;
  let remaining = Math.max(0, Math.floor(totalXp));
  while (level < MAX_LEVEL && remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  const maxed = level >= MAX_LEVEL;
  const needed = maxed ? 1 : xpForLevel(level);
  return {
    level,
    xpInLevel: maxed ? 0 : remaining,
    xpToNext: maxed ? 0 : needed - remaining,
    xpNeeded: needed,
    progress: maxed ? 1 : remaining / needed,
    maxed,
  };
}

/** 等级称号（个人中心展示用） */
export function levelTitle(level: number): string {
  if (level >= 40) return "传奇架构师";
  if (level >= 30) return "首席工程师";
  if (level >= 20) return "资深开发";
  if (level >= 12) return "全栈工程师";
  if (level >= 6) return "初级开发";
  if (level >= 3) return "学徒";
  return "新生";
}
