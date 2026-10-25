import type { Level, QuizLevel, Theme } from "./types";
import { algorithmsTheme } from "./themes/algorithms";
import { binaryTheme } from "./themes/binary";
import { cpuTheme } from "./themes/cpu";
import { databaseTheme } from "./themes/database";
import { networkTheme } from "./themes/network";
import { osTheme } from "./themes/os";
import { securityTheme } from "./themes/security";
import { webdevTheme } from "./themes/webdev";

/**
 * 主题注册表：新增主题时在 themes/ 下建文件，然后加进这个数组即可。
 * 顺序即解锁顺序。
 */
export const THEMES: Theme[] = [
  binaryTheme,
  cpuTheme,
  osTheme,
  networkTheme,
  algorithmsTheme,
  databaseTheme,
  webdevTheme,
  securityTheme,
];

export const ALL_LEVELS: Level[] = THEMES.flatMap((t) => t.levels);

export function findLevel(id: string): Level | undefined {
  return ALL_LEVELS.find((l) => l.id === id);
}

export function findLevelWithContext(id: string): {
  theme: Theme;
  level: Level;
  levelIndex: number;
  themeIndex: number;
} | null {
  for (let themeIndex = 0; themeIndex < THEMES.length; themeIndex++) {
    const theme = THEMES[themeIndex];
    const levelIndex = theme.levels.findIndex((l) => l.id === id);
    if (levelIndex >= 0) {
      return { theme, level: theme.levels[levelIndex], levelIndex, themeIndex };
    }
  }
  return null;
}

export function nextLevelOf(id: string): Level | null {
  const ctx = findLevelWithContext(id);
  if (!ctx) return null;
  const { theme, levelIndex, themeIndex } = ctx;
  if (levelIndex + 1 < theme.levels.length) {
    return theme.levels[levelIndex + 1];
  }
  const nextTheme = THEMES[themeIndex + 1];
  return nextTheme?.levels[0] ?? null;
}

export function isQuizLevel(level: Level): level is QuizLevel {
  return level.type === "quiz";
}
