/**
 * 密码强度核心计算（纯函数，可单测）。
 * 熵模型：熵 = 长度 × log2(字符集大小)，破解时间按 10^10 次猜测/秒、平均猜一半估算。
 * 这是教学用途的粗略模型（不含字典攻击/keyboard pattern），解析里会说明局限。
 */

export interface PasswordStrength {
  length: number;
  /** 用到的字符类别 */
  classes: string[];
  /** 字符集大小 */
  charsetSize: number;
  /** 熵（bit） */
  entropy: number;
  /** 平均破解时间的人类可读描述 */
  crackTime: string;
  /** 破解时间换算为年（不足 1 年为小数） */
  crackYears: number;
}

const CLASS_SETS: { name: string; size: number; test: RegExp }[] = [
  { name: "小写字母", size: 26, test: /[a-z]/ },
  { name: "大写字母", size: 26, test: /[A-Z]/ },
  { name: "数字", size: 10, test: /[0-9]/ },
  { name: "符号", size: 33, test: /[^a-zA-Z0-9]/ },
];

/** 熵 → 年 的换算基数：2^(熵-1) / 10^10 次每秒 / 31557600 秒每年 */
const SECONDS_PER_YEAR = 31_557_600;
const GUESSES_PER_SEC = 1e10;

export function analyzePassword(pw: string): PasswordStrength {
  const classes = CLASS_SETS.filter((c) => c.test.test(pw));
  const charsetSize = classes.reduce((s, c) => s + c.size, 0);
  const length = pw.length;
  const entropy = length === 0 || charsetSize === 0 ? 0 : length * Math.log2(charsetSize);
  const seconds = Math.pow(2, Math.max(0, entropy - 1)) / GUESSES_PER_SEC;
  const crackYears = seconds / SECONDS_PER_YEAR;
  return {
    length,
    classes: classes.map((c) => c.name),
    charsetSize,
    entropy: Math.round(entropy * 10) / 10,
    crackTime: formatDuration(seconds),
    crackYears,
  };
}

export function formatDuration(seconds: number): string {
  if (seconds < 1) return "不到 1 秒";
  if (seconds < 60) return `${Math.ceil(seconds)} 秒`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.ceil(minutes)} 分钟`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.ceil(hours)} 小时`;
  const days = hours / 24;
  if (days < 365) return `${Math.ceil(days)} 天`;
  const years = days / 365.25;
  if (years < 1e3) return `${Math.round(years)} 年`;
  if (years < 1e6) return `${Math.round(years / 1e3)} 千年`;
  if (years < 1e9) return `${Math.round(years / 1e6)} 百万年`;
  if (years < 1e12) return `${Math.round(years / 1e9)} 亿年`;
  return `${years.toExponential(1)} 年`;
}

/** 校验一道密码挑战是否达成 */
export function meetsChallenge(
  strength: PasswordStrength,
  challenge: {
    minLength?: number;
    minEntropy?: number;
    requireClasses?: string[];
    minCrackYears?: number;
  },
): boolean {
  if (challenge.minLength !== undefined && strength.length < challenge.minLength) return false;
  if (challenge.minEntropy !== undefined && strength.entropy < challenge.minEntropy) return false;
  if (challenge.requireClasses) {
    for (const cls of challenge.requireClasses) {
      // requireClasses 用短名，与内部"小写字母"等展示名做模糊匹配
      const short: Record<string, string> = {
        lower: "小写字母",
        upper: "大写字母",
        digit: "数字",
        symbol: "符号",
      };
      const full = short[cls] ?? cls;
      if (!strength.classes.includes(full)) return false;
    }
  }
  if (challenge.minCrackYears !== undefined && strength.crackYears < challenge.minCrackYears) {
    return false;
  }
  return true;
}
