import { describe, expect, it } from "vitest";
import { judgeRate } from "@/lib/rate-limit";

describe("rate-limit judgeRate", () => {
  const limit = { windowMs: 60_000, max: 3 };

  it("窗口内前 max 次放行", () => {
    let state = { hits: [] as number[] };
    for (let i = 0; i < 3; i++) {
      const r = judgeRate(state, 1000 + i * 10, limit);
      expect(r.result.allowed).toBe(true);
      state = r.next;
    }
    expect(state.hits).toHaveLength(3);
  });

  it("超限拒绝并给出重试等待时间", () => {
    const state = { hits: [1000, 2000, 3000] };
    const r = judgeRate(state, 3500, limit);
    expect(r.result.allowed).toBe(false);
    expect(r.result.retryAfterMs).toBe(1000 + 60_000 - 3500);
    // 拒绝时不追加记录
    expect(r.next.hits).toHaveLength(3);
  });

  it("窗口滑动后恢复放行", () => {
    const state = { hits: [1000, 2000, 3000] };
    // 61 秒后最早一条滑出，窗口内只剩 2 条 → 放行
    const r1 = judgeRate(state, 1000 + 60_000 + 1, limit);
    expect(r1.result.allowed).toBe(true);
    expect(r1.next.hits).toHaveLength(3); // 2 条旧记录（仍在窗口内）+ 1 条新记录
    // 63 秒后全部滑出 → 干净的新窗口
    const r2 = judgeRate(state, 63_001, limit);
    expect(r2.result.allowed).toBe(true);
    expect(r2.next.hits).toHaveLength(1);
  });

  it("过期记录不影响新窗口判定", () => {
    const state = { hits: [1, 2, 3, 999_999] };
    const r = judgeRate(state, 1_000_000, limit);
    expect(r.result.allowed).toBe(true);
  });
});
