"use client";

import { create } from "zustand";
import type { ResultState } from "@/components/game/ResultScreen";

/**
 * 关卡页游戏会话：完成一关的结算状态。
 * quiz 引擎 / 小游戏 → setResult → ResultScreen 展示并上报。
 */
interface GameState {
  result: ResultState | null;
  setResult: (r: ResultState | null) => void;
}

export const useGameStore = create<GameState>((set) => ({
  result: null,
  setResult: (result) => set({ result }),
}));

/** 上报成绩到服务端；未登录返回 not-authed，前端转为本地提示 */
export async function submitProgress(
  levelId: string,
  submission: { kind: "quiz"; answers: number[] } | { kind: "minigame"; performance: number },
): Promise<{ ok: boolean; authed: boolean; stars?: number; xpGained?: number }> {
  try {
    // 网络异常/挂起时 8 秒超时，避免结算界面无限等待
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ levelId, submission }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (res.status === 401) return { ok: false, authed: false };
    if (!res.ok) return { ok: false, authed: true };
    const data = await res.json();
    return { ok: true, authed: true, stars: data.stars, xpGained: data.xpGained };
  } catch {
    return { ok: false, authed: true };
  }
}
