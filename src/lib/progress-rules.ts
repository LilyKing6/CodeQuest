import { THEMES } from "@/content/registry";

/**
 * 关卡解锁与进度规则（纯函数，客户端展示与提交校验共用）。
 * 进度数据形如 { [levelId]: stars }，stars>0 视为已通关。
 */

export type ProgressMap = Record<string, number>;

/** 每个主题第一关免登录可玩 */
export function isFreePlayLevel(levelId: string): boolean {
  return THEMES.some((t) => t.levels[0]?.id === levelId);
}

/** 上一主题通关多少比例解锁下一主题 */
export const THEME_UNLOCK_RATIO = 0.8;

export function themeCompletedCount(progress: ProgressMap, themeIndex: number): number {
  const theme = THEMES[themeIndex];
  if (!theme) return 0;
  return theme.levels.filter((l) => (progress[l.id] ?? 0) > 0).length;
}

export function isThemeUnlocked(progress: ProgressMap, themeIndex: number): boolean {
  if (themeIndex <= 0) return true;
  const prev = THEMES[themeIndex - 1];
  const done = themeCompletedCount(progress, themeIndex - 1);
  return done >= Math.ceil(prev.levels.length * THEME_UNLOCK_RATIO);
}

export function isLevelUnlocked(
  progress: ProgressMap,
  themeIndex: number,
  levelIndex: number,
): boolean {
  if (!isThemeUnlocked(progress, themeIndex)) return false;
  if (levelIndex === 0) return true;
  const theme = THEMES[themeIndex];
  return (progress[theme.levels[levelIndex - 1].id] ?? 0) > 0;
}

/** 用户下一个该玩的关卡（用于「继续冒险」按钮） */
export function nextPlayableLevel(
  progress: ProgressMap,
): { themeIndex: number; levelIndex: number } | null {
  for (let t = 0; t < THEMES.length; t++) {
    if (!isThemeUnlocked(progress, t)) break;
    for (let l = 0; l < THEMES[t].levels.length; l++) {
      if ((progress[THEMES[t].levels[l].id] ?? 0) === 0 && isLevelUnlocked(progress, t, l)) {
        return { themeIndex: t, levelIndex: l };
      }
    }
  }
  return null;
}

export function totalStarsEarned(progress: ProgressMap): number {
  return Object.values(progress).reduce((s, v) => s + v, 0);
}

export function totalStarsPossible(): number {
  return THEMES.reduce((s, t) => s + t.levels.length * 3, 0);
}
