import type { Theme } from "../types";

export const binaryTheme: Theme = {
  id: "binary",
  title: "二进制与逻辑门",
  description:
    "计算机只认识 0 和 1。学会二进制的读法、位的组合，再用逻辑门拼出计算机的「思维规则」。",
  icon: "⚡",
  color: "#8b5cf6",
  levels: [
    {
      id: "binary-1",
      type: "quiz",
      title: "另一种数数方式",
      intro:
        "人类有十根手指，所以习惯十进制；计算机的电路只有「通电/断电」两种状态，所以它用二进制。先来建立数制的直觉。",
      questions: [
        {
          id: "binary-1-q1",
          prompt: "二进制数 `101` 换算成十进制是多少？",
          options: ["3", "5", "6", "101"],
          answer: 1,
          explanation:
            "从右往左每位分别代表 2⁰、2¹、2²，即 1×4 + 0×2 + 1×1 = 5。",
        },
        {
          id: "binary-1-q2",
          prompt: "十进制数 6 的二进制表示是？",
          options: ["`110`", "`101`", "`011`", "`1100`"],
          answer: 0,
          explanation: "6 = 4 + 2 = 1×2² + 1×2¹ + 0×2⁰，所以是 110。",
        },
        {
          id: "binary-1-q3",
          prompt: "二进制中每一位叫一个「位」，它的英文名是？",
          options: ["Byte", "Bit", "Word", "Nibble"],
          answer: 1,
          explanation:
            "bit（位）是 binary digit 的缩写，一个 bit 只能是 0 或 1；8 个 bit 组成一个 Byte（字节）。",
        },
        {
          id: "binary-1-q4",
          prompt: "为什么计算机选择二进制而不是十进制？",
          options: [
            "二进制运算结果更精确",
            "两种状态最容易用电路区分，抗干扰能力强",
            "二进制数写起来更短",
            "历史原因，没有技术优势",
          ],
          answer: 1,
          explanation:
            "电压高低、开关通断这类「两种状态」在物理上最容易制造和保持稳定，多档电压反而容易出错。这才是根本原因。",
        },
        {
          id: "binary-1-q5",
          prompt: "二进制 `1111` 等于十进制的多少？",
          options: ["14", "15", "16", "11"],
          answer: 1,
          explanation: "8 + 4 + 2 + 1 = 15。四位全 1 是 2⁴−1 = 15，这是常用结论。",
        },
        {
          id: "binary-1-q6",
          prompt: "十进制 10 用二进制表示是？",
          options: ["`1010`", "`1100`", "`1001`", "`1011`"],
          answer: 0,
          explanation: "10 = 8 + 2 = 1×2³ + 0×2² + 1×2¹ + 0×2⁰，即 1010。",
        },
        {
          id: "binary-1-q7",
          prompt: "八进制使用数字 0~7。十进制 8 在八进制中写作？",
          options: ["`8`", "`10`", "`18`", "`100`"],
          answer: 1,
          explanation:
            "八进制逢八进一。8 恰好等于一个「八」，个位归零进一位，写作 10。同理十进制的 10 在十进制里也是「逢十进一」的结果。",
        },
      ],
    },
    {
      id: "binary-2",
      type: "minigame",
      title: "二进制灯泡",
      intro:
        "八个灯泡各代表一个位。拨动开关让灯泡组合出的数值等于目标数——用手指头数出 2 的幂，你就是二进制原住民。",
      game: "binary-bulbs",
      config: {
        bits: 8,
        targets: [5, 13, 42, 99, 170, 255],
        maxMistakes: 3,
      },
    },
    {
      id: "binary-3",
      type: "quiz",
      title: "字节的世界",
      intro:
        "一个字节 8 位，能表达多少种状态？字符、颜色、内存容量都从这套规则里生长出来。",
      questions: [
        {
          id: "binary-3-q1",
          prompt: "1 Byte 等于多少 bit？",
          options: ["4", "8", "16", "1024"],
          answer: 1,
          explanation: "1 Byte = 8 bit，这是业界统一约定。",
        },
        {
          id: "binary-3-q2",
          prompt: "一个字节（8 位）最多能表示多少个不同的值？",
          options: ["8 个", "128 个", "256 个", "1024 个"],
          answer: 2,
          explanation: "每位有 0/1 两种可能，8 位就是 2⁸ = 256 种组合（0~255）。",
        },
        {
          id: "binary-3-q3",
          prompt: "无符号 8 位二进制能表示的最大数是？",
          options: ["128", "255", "256", "511"],
          answer: 1,
          explanation: "全 1（11111111）= 2⁸ − 1 = 255。256 已经需要第 9 位了。",
        },
        {
          id: "binary-3-q4",
          prompt: "16 进制数 `FF` 等于十进制的多少？",
          options: ["15", "128", "255", "256"],
          answer: 2,
          explanation:
            "F 代表 15，FF = 15×16 + 15 = 255，正好是一个字节的最大值——所以十六进制常用来简写字节。",
        },
        {
          id: "binary-3-q5",
          prompt: "KB、MB、GB 之间按二进制习惯（IEC 标准）的换算是？",
          options: [
            "1 KB = 1000 B",
            "1 KB = 1024 B，1 MB = 1024 KB",
            "1 MB = 1000 KB",
            "1 GB = 1024 B",
          ],
          answer: 1,
          explanation:
            "二进制习惯按 2¹⁰ = 1024 换算（严格写法是 KiB/MiB）。硬盘厂商常用 1000 进制，所以买的「1TB」在系统里显示会变小——两套标准的差异。",
        },
        {
          id: "binary-3-q6",
          prompt: "ASCII 码用一个字节表示字符，字符 `A` 的十进制值是 65。字符 `a`（小写）的值是？",
          options: ["32", "65", "97", "129"],
          answer: 2,
          explanation:
            "小写 a 是 97 = 65 + 32，大小写字母恰好相差 32（二进制里就是第 5 位翻转），这让大小写转换可以用一个位运算完成。",
        },
        {
          id: "binary-3-q7",
          prompt: "表示 0~1000 的所有整数，至少需要多少位？",
          options: ["8 位", "9 位", "10 位", "11 位"],
          answer: 2,
          explanation:
            "2⁹ = 512 < 1001 ≤ 1024 = 2¹⁰，所以 10 位。判断「至少几位」就是找 2ⁿ ≥ 最大值+1 的最小 n。",
        },
      ],
    },
    {
      id: "binary-4",
      type: "minigame",
      title: "逻辑门实验室",
      intro:
        "AND、OR、NOT、XOR 是计算机全部判断力的源头。给门电路输入信号，选出正确的输出——三次全对可以挑战连续通关！",
      game: "logic-gates",
      config: {
        puzzles: [
          { gate: "AND", inputs: [1, 1], answer: 1 },
          { gate: "AND", inputs: [1, 0], answer: 0 },
          { gate: "OR", inputs: [0, 0], answer: 0 },
          { gate: "OR", inputs: [1, 0], answer: 1 },
          { gate: "NOT", inputs: [1], answer: 0 },
          { gate: "XOR", inputs: [1, 1], answer: 0 },
          { gate: "XOR", inputs: [1, 0], answer: 1 },
          { gate: "AND", inputs: [1, 1], answer: 1 },
          { gate: "XOR", inputs: [0, 0], answer: 0 },
          { gate: "NOT", inputs: [0], answer: 1 },
        ],
      },
    },
    {
      id: "binary-5",
      type: "quiz",
      title: "逻辑的化学反应",
      intro:
        "把与或非组合起来，就能表达「如果……那么……」这类复杂判断。这关考验你组合逻辑的想象力。",
      questions: [
        {
          id: "binary-5-q1",
          prompt: "`1 XOR 1` 的结果是？",
          options: ["0", "1", "2", "不确定"],
          answer: 0,
          explanation:
            "XOR（异或）只在两个输入不同时输出 1；相同则输出 0。1 和 1 相同，所以是 0。",
        },
        {
          id: "binary-5-q2",
          prompt: "哪个逻辑门的输出是「两个输入都为 1 时才为 1」？",
          options: ["OR", "AND", "XOR", "NOT"],
          answer: 1,
          explanation: "AND 就是「并且」：两个条件同时成立，结果才成立。",
        },
        {
          id: "binary-5-q3",
          prompt: "`NOT (1 AND 0)` 的结果是？",
          options: ["0", "1", "2", "无法计算"],
          answer: 1,
          explanation: "先算括号：1 AND 0 = 0；再取反：NOT 0 = 1。",
        },
        {
          id: "binary-5-q4",
          prompt: "用 AND、OR、NOT 搭建「两输入不一样时报警」的电路，应该用哪个逻辑表达？",
          options: ["A AND B", "A OR B", "A XOR B", "NOT A"],
          answer: 2,
          explanation:
            "「不一样」正是 XOR 的定义，它也叫「异或」，是加法器、比较器的核心零件。",
        },
        {
          id: "binary-5-q5",
          prompt: "在位的层面，`XOR` 运算有个著名用途是？",
          options: [
            "计算两数之和",
            "不用临时变量交换两个值 / 简单加密",
            "判断奇偶",
            "取绝对值",
          ],
          answer: 1,
          explanation:
            "a^=b; b^=a; a^=b 三步即可交换两值； XOR 还是对称加密的基础（同一密钥异或两次还原数据）。",
        },
        {
          id: "binary-5-q6",
          prompt: "逻辑门在硬件上主要由什么构成？",
          options: ["机械继电器", "晶体管", "光敏电阻", "磁芯"],
          answer: 1,
          explanation:
            "现代芯片里，一个逻辑门由若干晶体管组成。数十亿晶体管集成就成了 CPU——逻辑门是硬件与逻辑的交界点。",
        },
        {
          id: "binary-5-q7",
          prompt: "`(1 OR 0) AND (NOT 0)` 的结果是？",
          options: ["0", "1", "未定义", "10"],
          answer: 1,
          explanation: "1 OR 0 = 1；NOT 0 = 1；1 AND 1 = 1。",
        },
      ],
    },
  ],
};
