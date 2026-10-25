import { describe, expect, it } from "vitest";
import { analyzePassword, meetsChallenge, formatDuration } from "@/components/games/password-logic";
import { totalWidth, widthDiff } from "@/components/games/css-box-logic";

describe("password-logic", () => {
  it("空密码熵为 0", () => {
    const s = analyzePassword("");
    expect(s.entropy).toBe(0);
    expect(s.crackTime).toBe("不到 1 秒");
  });

  it("纯数字 6 位：字符集 10，熵 ≈ 20 bit", () => {
    const s = analyzePassword("123456");
    expect(s.charsetSize).toBe(10);
    expect(s.entropy).toBeCloseTo(6 * Math.log2(10), 1);
    expect(s.classes).toEqual(["数字"]);
  });

  it("大小写+数字+符号扩展字符集，熵显著提高", () => {
    const low = analyzePassword("abcdefgh");
    const mixed = analyzePassword("Abc123!@#");
    expect(mixed.entropy).toBeGreaterThan(low.entropy);
    expect(mixed.charsetSize).toBe(26 + 26 + 10 + 33);
  });

  it("长度翻倍熵翻倍（线性关系）", () => {
    const a = analyzePassword("ab");
    const b = analyzePassword("abcd");
    expect(b.entropy).toBeCloseTo(a.entropy * 2, 5);
  });

  it("meetsChallenge 各条件", () => {
    const s = analyzePassword("Abc123!@#"); // 9 个字符
    expect(s.length).toBe(9);
    expect(meetsChallenge(s, { minLength: 9 })).toBe(true);
    expect(meetsChallenge(s, { minLength: 10 })).toBe(false);
    expect(meetsChallenge(s, { requireClasses: ["lower", "upper", "digit"] })).toBe(true);
    expect(meetsChallenge(s, { requireClasses: ["lower", "upper", "digit", "symbol"] })).toBe(true);
    expect(meetsChallenge(s, { minEntropy: 70 })).toBe(false);
  });

  it("minCrackYears 条件：强密码过、弱密码不过", () => {
    const strong = analyzePassword("xK9$mQ2#vL8p");
    expect(meetsChallenge(strong, { minCrackYears: 1000 })).toBe(true);
    const weak = analyzePassword("123456");
    expect(meetsChallenge(weak, { minCrackYears: 1000 })).toBe(false);
  });

  it("formatDuration 阶梯", () => {
    expect(formatDuration(0.5)).toBe("不到 1 秒");
    expect(formatDuration(30)).toBe("30 秒");
    expect(formatDuration(3600)).toBe("1 小时");
    expect(formatDuration(3600 * 24 * 400)).toContain("年");
  });
});

describe("css-box-logic", () => {
  it("总宽 = content + padding×2 + border×2", () => {
    expect(totalWidth({ contentWidth: 120, padding: 10, border: 0 })).toBe(140);
    expect(totalWidth({ contentWidth: 120, padding: 0, border: 5 })).toBe(130);
    expect(totalWidth({ contentWidth: 120, padding: 15, border: 10 })).toBe(170);
  });

  it("widthDiff 正负号：正为超、负为差", () => {
    expect(widthDiff({ contentWidth: 120, padding: 10, border: 0 }, 140)).toBe(0);
    expect(widthDiff({ contentWidth: 120, padding: 20, border: 0 }, 140)).toBe(20);
    expect(widthDiff({ contentWidth: 120, padding: 5, border: 0 }, 140)).toBe(-10);
  });

  it("padding/border 为 0 时等于 content", () => {
    expect(totalWidth({ contentWidth: 100, padding: 0, border: 0 })).toBe(100);
  });
});
