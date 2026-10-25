"use client";

import { submitProgress } from "@/lib/game-store";
import { scoreMiniGame } from "@/lib/scoring";
import type { MiniGameLevel } from "@/content/types";
import type { MiniGameProps } from "./types";

/** 小游戏统一收尾：本地评星 → 立即结算 → 异步上报（网络挂起不阻塞 UI） */
export async function finishMiniGame(
  props: Pick<MiniGameProps, "level" | "nextLevelId" | "authed" | "onFinish">,
  performance: number,
): Promise<void> {
  const { level, nextLevelId, authed, onFinish } = props;
  const local = scoreMiniGame(level as MiniGameLevel, performance);
  if (!local.passed) {
    onFinish({
      passed: false,
      stars: 0,
      xp: 0,
      saveState: "error",
    });
    return;
  }
  if (!authed) {
    onFinish({ passed: true, stars: local.stars, xp: local.xp, saveState: "not-authed" });
    return;
  }
  onFinish({ passed: true, stars: local.stars, xp: local.xp, saveState: "saved" });
  const up = await submitProgress(level.id, { kind: "minigame", performance });
  if (!up.ok) {
    onFinish({ passed: true, stars: local.stars, xp: local.xp, saveState: "error" });
  }
}
