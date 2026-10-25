/**
 * 轻量内存滑动窗口限流（纯函数核心 + 单进程存储）。
 * 单容器部署下足够；多实例时换 Redis（接口不变，只换 store）。
 */

export interface RateLimitResult {
  allowed: boolean;
  /** 拒绝时多少毫秒后可重试 */
  retryAfterMs: number;
}

export interface BucketState {
  /** 窗口内的请求时间戳（ms） */
  hits: number[];
}

export const PROGRESS_LIMIT = { windowMs: 60_000, max: 12 } as const;

/** 判定一次请求是否放行，并返回新的桶状态（不改原数组） */
export function judgeRate(
  state: BucketState,
  now: number,
  limit: { windowMs: number; max: number },
): { result: RateLimitResult; next: BucketState } {
  const windowStart = now - limit.windowMs;
  const fresh = state.hits.filter((t) => t > windowStart);
  if (fresh.length >= limit.max) {
    const retryAfterMs = fresh[0] + limit.windowMs - now;
    return { result: { allowed: false, retryAfterMs }, next: { hits: fresh } };
  }
  fresh.push(now);
  return { result: { allowed: true, retryAfterMs: 0 }, next: { hits: fresh } };
}

/** 进程内桶存储：key = userId（成绩上报按用户限流） */
const buckets = new Map<string, BucketState>();

export function checkRateLimit(
  key: string,
  limit: { windowMs: number; max: number } = PROGRESS_LIMIT,
): RateLimitResult {
  const now = Date.now();
  const { result, next } = judgeRate(buckets.get(key) ?? { hits: [] }, now, limit);
  buckets.set(key, next);
  // 顺带清理：桶数过多时丢掉已过期的，防内存缓慢增长
  if (buckets.size > 10_000) {
    for (const [k, v] of buckets) {
      if (v.hits.every((t) => t <= now - limit.windowMs)) buckets.delete(k);
    }
  }
  return result;
}
