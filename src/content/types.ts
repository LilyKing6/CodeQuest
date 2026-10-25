/* ------------------------------------------------------------------ *
 * 内容即数据：主题 / 关卡 / 题库全部由这些类型约束。
 * 新增主题 = 在 themes/ 下新增文件并在 registry.ts 注册，无需改业务代码。
 * ------------------------------------------------------------------ */

/** 知识主题（一块「知识大陆」） */
export interface Theme {
  /** 全局唯一 id，如 "binary"；同时是 URL 段 */
  id: string;
  title: string;
  description: string;
  /** emoji 图标 */
  icon: string;
  /** 主题色（hex），用于卡片光晕等点缀 */
  color: string;
  /** 关卡按顺序解锁 */
  levels: Level[];
}

export interface BaseLevel {
  /** 全局唯一 id，如 "binary-1"；同时是 URL 段 */
  id: string;
  title: string;
  /** 开场引导文案 */
  intro: string;
}

/** 答题关卡 */
export interface QuizLevel extends BaseLevel {
  type: "quiz";
  questions: Question[];
}

export interface Question {
  id: string;
  /** 题干；行内代码用反引号 `xxx` 标记，渲染为等宽字体 */
  prompt: string;
  options: string[];
  /** 正确选项下标（单选） */
  answer: number;
  /** 答题后展示的解析 */
  explanation: string;
}

/** 各互动小游戏的自定义配置（按游戏 id 索引） */
export interface MiniGameConfigs {
  "binary-bulbs": BinaryBulbsConfig;
  "logic-gates": LogicGatesConfig;
  "cpu-sim": CpuSimConfig;
  "cpu-scheduler": SchedulerConfig;
  "tcp-handshake": TcpHandshakeConfig;
  "subnetting": SubnettingConfig;
  "binary-search": BinarySearchConfig;
  "bubble-sort": BubbleSortConfig;
  /** 通用左右配对（多主题复用） */
  "matching": MatchingConfig;
  "sql-builder": SqlBuilderConfig;
  "css-box": CssBoxConfig;
  "password-lab": PasswordLabConfig;
}

export type MiniGameId = keyof MiniGameConfigs;

/** 互动小游戏关卡。config 的形状由游戏 id 决定，见 MiniGameConfigs */
export interface MiniGameLevel extends BaseLevel {
  type: "minigame";
  game: MiniGameId;
  config: MiniGameConfigs[MiniGameId];
}

export type Level = QuizLevel | MiniGameLevel;

/* ---------- 各小游戏配置 ---------- */

export interface BinaryBulbsConfig {
  /** 位数（默认 8） */
  bits?: number;
  /** 连续目标数列表；玩家逐个把二进制拨到目标值 */
  targets: number[];
  /** 每题最大失误次数（超过则失败重来） */
  maxMistakes?: number;
}

export interface LogicGatesConfig {
  /** 关卡题目列表 */
  puzzles: LogicGatePuzzle[];
}

export interface LogicGatePuzzle {
  /** 门类型 */
  gate: "AND" | "OR" | "NOT" | "XOR";
  /** 输入信号（NOT 只有一个） */
  inputs: (0 | 1)[];
  /** 期望玩家选择的输出 */
  answer: 0 | 1;
}

export interface CpuSimConfig {
  /** LMC 风格指令程序：操作码 + 可选操作数 */
  program: { op: string; arg?: number }[];
  /** 要回答的问题：程序执行完后某输出的值 */
  askOutputIndex: number;
}

export interface SchedulerConfig {
  /** 进程列表（到达时间均为 0，按玩家排列顺序执行） */
  processes: { name: string; burst: number }[];
}

export interface TcpHandshakeConfig {
  /** 步骤池（打乱展示），按正确顺序点击 */
  steps: string[];
}

export interface SubnettingConfig {
  /** 网络前缀，如 "192.168.1.0/24" */
  cidr: string;
  /** 设备与它们应该落入的分组 */
  groups: { name: string; hostPart: string }[];
  /** 干扰项（不属于任何组的地址） */
  decoys: string[];
}

export interface BinarySearchConfig {
  /** 1..n 的有序数组中藏一个目标数，玩家二分缩小范围 */
  max: number;
  target: number;
  /** 允许的最大猜测次数 */
  maxGuesses: number;
}

export interface BubbleSortConfig {
  /** 待排序数字（4~6 个） */
  numbers: number[];
  /** 最少交换次数上限（用于评星） */
  parSwaps: number;
}

/** 通用左右配对：点选左侧一项与右侧一项完成配对 */
export interface MatchingConfig {
  /** 正确配对（5~6 对） */
  pairs: { left: string; right: string }[];
  /** 主题色点缀（可选，缺省用品牌紫） */
  accent?: string;
}

/** SQL 查询拼装：按语义目标把乱序片段拼成正确语句 */
export interface SqlBuilderConfig {
  puzzles: {
    /** 用自然语言描述的查询目标 */
    goal: string;
    /** 打乱展示的子句片段 */
    fragments: string[];
    /** 正确顺序（fragments 的下标序列） */
    answer: number[];
    /** 装配完成后对应的完整 SQL（解析展示用） */
    finalSql: string;
  }[];
}

/** CSS 盒模型挑战：调整 padding/border 使元素总宽命中目标 */
export interface CssBoxConfig {
  /** 固定内容宽度 */
  contentWidth: number;
  /** 目标总宽列表（逐关） */
  targets: { total: number; hint: string }[];
}

/** 密码强度实验室：达成全部条件即通关 */
export interface PasswordLabConfig {
  /** 各关目标条件（全部满足则该关通过） */
  challenges: {
    name: string;
    /** 最小长度 */
    minLength?: number;
    /** 最小熵（bit） */
    minEntropy?: number;
    /** 必须包含的字符类别：lower/upper/digit/symbol */
    requireClasses?: string[];
    /** 估算破解时间下限（如 "100 years"，由熵换算） */
    minCrackYears?: number;
  }[];
}
