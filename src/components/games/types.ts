import type { MiniGameLevel } from "@/content/types";
import type { ResultState } from "@/components/game/ResultScreen";

/** 所有小游戏的统一 Props 契约 */
export interface MiniGameProps {
  level: MiniGameLevel;
  nextLevelId: string | null;
  authed: boolean;
  /** 完成游戏：把结算结果交给关卡页（ResultScreen 展示 + 上报） */
  onFinish: (r: Omit<ResultState, "level" | "nextLevelId" | "onRetry">) => void;
}
