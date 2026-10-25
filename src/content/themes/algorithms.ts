import type { Theme } from "../types";

export const algorithmsTheme: Theme = {
  id: "algorithms",
  title: "算法入门",
  description:
    "算法是解决问题的步骤艺术。猜数字体会二分思想，亲手冒泡排序，再用复杂度看清快慢的本质。",
  icon: "🧩",
  color: "#fbbf24",
  levels: [
    {
      id: "algo-1",
      type: "quiz",
      title: "什么是算法",
      intro:
        "菜谱是算法，乐谱是算法，导航规划也是算法。这一关建立对「算法」与「好坏标准」的直觉。",
      questions: [
        {
          id: "algo-1-q1",
          prompt: "算法的正式定义是？",
          options: [
            "一段数学公式",
            "解决问题的有限、明确、有效的步骤序列",
            "任何程序代码",
            "一种编程语言",
          ],
          answer: 1,
          explanation:
            "算法五特征：输入、输出、确定性、有限性、可行性。「有限」很重要——死循环不算算法。",
        },
        {
          id: "algo-1-q2",
          prompt: "同一个问题的两个算法，「更好」通常指？",
          options: [
            "代码更长",
            "输入规模增大时，运行时间与空间增长更慢",
            "变量名更好看",
            "用了更多语言特性",
          ],
          answer: 1,
          explanation:
            "衡量算法看「随规模增长的趋势」（复杂度），而不是常数快慢或代码风格——这是算法分析的核心视角。",
        },
        {
          id: "algo-1-q3",
          prompt: "大 O 记号 `O(n)` 描述的是？",
          options: [
            "算法运行的具体秒数",
            "运行时间随输入规模 n 增长的渐近上界（量级）",
            "代码行数",
            "bug 数量",
          ],
          answer: 1,
          explanation:
            "O 描述增长趋势：O(n) 规模翻倍耗时翻倍；O(n²) 规模翻倍耗时变四倍。它忽略常数，只看形状。",
        },
        {
          id: "algo-1-q4",
          prompt: "在无序的 1000 个名字里找「张三」，逐个对比最多要查几次？",
          options: ["1 次", "10 次", "1000 次", "1000000 次"],
          answer: 2,
          explanation:
            "线性查找最坏要看完全部 n 个——O(n)。若已按拼音排序，二分只要 ~10 次（log₂1000≈10）——下关你就玩到。",
        },
        {
          id: "algo-1-q5",
          prompt: "以下常见复杂度从小到大排序正确的是？",
          options: [
            "O(1) < O(log n) < O(n) < O(n log n) < O(n²)",
            "O(n) < O(1) < O(log n) < O(n²)",
            "O(log n) < O(1) < O(n²) < O(n)",
            "O(n²) < O(n log n) < O(n) < O(1)",
          ],
          answer: 0,
          explanation:
            "记住这条阶梯：常数 < 对数 < 线性 < 线性对数 < 平方 < 指数。规模一大，阶梯之间就是天文数字差距。",
        },
        {
          id: "algo-1-q6",
          prompt: "「分治法」的核心思路是？",
          options: [
            "把问题拆成更小的同类子问题，解决后合并结果",
            "把数据存到硬盘",
            "随机尝试直到成功",
            "逐个比较所有可能",
          ],
          answer: 0,
          explanation:
            "分而治之：二分查找（每次排除一半）、归并排序（拆到单个再合并）都是分治——递归是它天然的实现工具。",
        },
        {
          id: "algo-1-q7",
          prompt: "递归函数必须有？",
          options: [
            "for 循环",
            "基准情形（base case），否则无限递归",
            "全局变量",
            "两个以上参数",
          ],
          answer: 1,
          explanation:
            "递归 = 自己调用自己 + 停止条件。缺了基准情形就是栈溢出（Stack Overflow）——那个程序员网站的梗来源。",
        },
      ],
    },
    {
      id: "algo-2",
      type: "minigame",
      title: "二分搜索猜数字",
      intro:
        "1~100 藏着一个数，每次猜测会告诉你大了还是小了。数学证明：二分策略 7 次内必中。试试你能几次！",
      game: "binary-search",
      config: {
        max: 100,
        target: 73,
        maxGuesses: 7,
      },
    },
    {
      id: "algo-3",
      type: "minigame",
      title: "冒泡排序排排看",
      intro:
        "只能交换相邻两个数，把序列变成升序。最少的交换次数就是「逆序对」个数——冒泡排序的代价本质。",
      game: "bubble-sort",
      config: {
        numbers: [7, 3, 9, 2, 5],
        parSwaps: 6,
      },
    },
    {
      id: "algo-4",
      type: "quiz",
      title: "复杂度仪表盘",
      intro:
        "学会读复杂度，你就能在代码写出来之前预判它的性能命运。",
      questions: [
        {
          id: "algo-4-q1",
          prompt: "二分查找的时间复杂度是？",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          answer: 1,
          explanation:
            "每次比较排除一半：n → n/2 → n/4 → … → 1，共 log₂n 步。10 亿数据也只要 30 次。",
        },
        {
          id: "algo-4-q2",
          prompt: "冒泡排序的平均时间复杂度是？",
          options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
          answer: 2,
          explanation:
            "两层循环：比较次数约 n²/2。相邻交换类排序（冒泡/插入/选择）都是 O(n²)——数据量大时被 O(n log n) 的快排/归并碾压。",
        },
        {
          id: "algo-4-q3",
          prompt: "访问数组 `arr[5]` 的复杂度是？",
          options: ["O(1)", "O(log n)", "O(n)", "O(5)"],
          answer: 0,
          explanation:
            "数组连续存储 + 下标直接计算地址，一步到位 O(1)——这就是数组「随机访问」超能力（链表做不到，要 O(n)）。",
        },
        {
          id: "algo-4-q4",
          prompt: "在链表头部插入一个节点是 O(1)，数组头部插入是？",
          options: ["O(1)", "O(log n)", "O(n)——后面全部后移", "O(n²)"],
          answer: 2,
          explanation:
            "数组要保持连续，头部插入得把所有元素搬后一位。数据结构的选择就是「你常用哪种操作」的选择。",
        },
        {
          id: "algo-4-q5",
          prompt: "「时间换空间」的例子是？",
          options: [
            "缓存/记忆化：多占内存减少重复计算",
            "用更慢的算法",
            "删掉变量",
            "压缩图片",
          ],
          answer: 0,
          explanation:
            "记忆化递归（如斐波那契）把已算结果存表，从 O(2ⁿ) 降到 O(n)——空间换时间是最常见的工程权衡（反之亦然）。",
        },
        {
          id: "algo-4-q6",
          prompt: "快速排序平均 O(n log n)，但最坏会退化为？",
          options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
          answer: 2,
          explanation:
            "每次划分都极不均衡（如已排序数组取首元素为基准）时退化 O(n²)。随机选基准可让最坏几乎不出现。",
        },
        {
          id: "algo-4-q7",
          prompt: "哈希表（字典）查找平均是 O(1)，它靠的是？",
          options: [
            "数据有序",
            "哈希函数直接算出存储位置",
            "并行计算",
            "常量比较小",
          ],
          answer: 1,
          explanation:
            "key 经哈希函数映射为下标，直接寻址。代价：无序、冲突需处理、最坏 O(n)。空间利用率换速度的典范。",
        },
      ],
    },
    {
      id: "algo-5",
      type: "quiz",
      title: "大陆结算 · 算法",
      intro: "终极结算：从思想到复杂度，为你的冒险画上句点（这只是起点！）。",
      questions: [
        {
          id: "algo-5-q1",
          prompt: "「贪心算法」的特点是？",
          options: [
            "每步取当前最优解，期望全局最优（不保证总是成立）",
            "穷举所有可能",
            "把问题拆成子问题递归",
            "随机选择",
          ],
          answer: 0,
          explanation:
            "贪心目光短浅但高效：找零钱、区间调度可用；0-1 背包则不行。证明贪心正确性才是难点。",
        },
        {
          id: "algo-5-q2",
          prompt: "动态规划与分治的区别在于？",
          options: [
            "动态规划子问题重叠，用表存储避免重复计算",
            "动态规划不能用递归",
            "分治更快",
            "没有区别",
          ],
          answer: 0,
          explanation:
            "子问题不重叠→分治（归并排序）；重叠→DP 记忆化（斐波那契、背包、编辑距离）。「重叠子问题+最优子结构」是 DP 的钥匙。",
        },
        {
          id: "algo-5-q3",
          prompt: "图的广度优先搜索（BFS）适合求？",
          options: [
            "无权图最短路径",
            "最大值",
            "排序",
            "哈希",
          ],
          answer: 0,
          explanation:
            "BFS 按层扩散，首次到达即最少步数——迷宫最短路、社交网络「几度分隔」都是它。带权图最短路则用 Dijkstra。",
        },
        {
          id: "algo-5-q4",
          prompt: "O(n²) 的算法在 n=10⁶ 时约执行 10¹² 步，家用电脑（约 10⁹ 步/秒）要跑多久？",
          options: ["1 秒", "约 17 分钟", "1 毫秒", "10 秒"],
          answer: 1,
          explanation:
            "10¹²/10⁹ = 1000 秒 ≈ 17 分钟。换成 O(n log n) 只要 ~0.02 秒——复杂度的鸿沟不是优化常数能填的。",
        },
        {
          id: "algo-5-q5",
          prompt: "「旅行商问题（TSP）」是 NP 难问题，意思是？",
          options: [
            "无法求解",
            "尚不知有多项式时间精确算法，大规模只能用近似/启发式",
            "只有图灵能解",
            "是物理问题",
          ],
          answer: 1,
          explanation:
            "NP 难 ≠ 不可解：小规模可精确算（暴力/动态规划），大规模用近似算法。P=NP 是否成立是千禧年大奖难题。",
        },
        {
          id: "algo-5-q6",
          prompt: "学完五大主题，最正确的下一步是？",
          options: [
            "背下所有结论",
            "动手写代码验证这些思想（刷题/做项目），在错误中加深理解",
            "换一个新网站再学一遍",
            "已经够了",
          ],
          answer: 1,
          explanation:
            "知识在指尖而非眼底：写一个二分、实现一次冒泡、抓一次 TCP 包——CodeQuest 只是你的第一级台阶 🎉",
        },
      ],
    },
  ],
};
