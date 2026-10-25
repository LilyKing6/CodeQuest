import type { Theme } from "../types";

export const databaseTheme: Theme = {
  id: "database",
  title: "数据库与 SQL",
  description:
    "数据如何安放四十年不过时？从表与主键到 JOIN 与事务，再亲手拼装 SQL 查询语句。",
  icon: "🗄️",
  color: "#38bdf8",
  levels: [
    {
      id: "db-1",
      type: "quiz",
      title: "为什么需要数据库",
      intro:
        "把数据存进文本文件行不行？小项目可以，但并发、检索、一致性会把文件方案撕碎。先建立对数据库的坐标系。",
      questions: [
        {
          id: "db-1-q1",
          prompt: "关系型数据库中，一张「表（Table）」的每一行叫？",
          options: ["字段（Field）", "记录/行（Row）", "索引（Index）", "视图（View）"],
          answer: 1,
          explanation:
            "行 = 一条记录（一个实体实例），列 = 字段（实体的一个属性）。学生表的一行就是一个学生。",
        },
        {
          id: "db-1-q2",
          prompt: "主键（Primary Key）的作用是？",
          options: [
            "加密整张表",
            "唯一标识表中的每一行，不允许重复、不允许为空",
            "让查询变快（这是它顺带的好处）",
            "连接两台服务器",
          ],
          answer: 1,
          explanation:
            "主键是行的「身份证号」：唯一 + 非空。数据库通常会在主键上自动建索引，所以它也确实能加速查找——但那是结果不是定义。",
        },
        {
          id: "db-1-q3",
          prompt: "相比把数据存在多个文本文件里，数据库管理系统（DBMS）的核心优势不包括？",
          options: [
            "事务保证操作要么全成要么全不做",
            "支持大量并发读写而不互相踩踏",
            "按条件高效检索（索引）",
            "自动帮业务写出正确的代码",
          ],
          answer: 3,
          explanation:
            "DBMS 提供的是数据层的保证（事务/并发/检索/备份），业务逻辑仍要程序员自己写——数据库不会替你思考需求。",
        },
        {
          id: "db-1-q4",
          prompt: "SQL 是什么？",
          options: [
            "一种通用编程语言，可以写操作系统",
            "专门与关系数据库交互的声明式语言",
            "某家公司的私有协议",
            "浏览器的脚本语言",
          ],
          answer: 1,
          explanation:
            "SQL 是声明式的：你「描述想要什么数据」，由数据库的查询优化器决定怎么取——这是它与 C/Java 这类命令式语言的根本区别。",
        },
        {
          id: "db-1-q5",
          prompt: "常见的开源关系数据库是？",
          options: ["Redis", "PostgreSQL 和 MySQL", "MongoDB", "Elasticsearch"],
          answer: 1,
          explanation:
            "PostgreSQL/MySQL 是最主流的开源关系库。Redis 是内存键值存储，MongoDB 是文档型，ES 是搜索引擎——它们统称 NoSQL，定位不同。",
        },
        {
          id: "db-1-q6",
          prompt: "「学生表里每个学生的学号都不一样」，学号字段适合作为？",
          options: ["外键", "主键", "视图", "游标"],
          answer: 1,
          explanation: "天然唯一且不变的列是理想主键。若无这样的列，通常用自增 id 或 UUID 代替。",
        },
        {
          id: "db-1-q7",
          prompt: "数据库的「schema（模式/结构）」指的是？",
          options: [
            "数据库的登录密码",
            "表、列、类型与约束的整体结构定义",
            "查询的结果",
            "备份文件",
          ],
          answer: 1,
          explanation:
            "schema 是数据的骨架（有哪些表、每表哪些列、什么类型、什么约束）。本站的 Drizzle 迁移管理的就是它。",
        },
      ],
    },
    {
      id: "db-2",
      type: "quiz",
      title: "SQL 查询入门",
      intro:
        "SELECT 是 SQL 的灵魂。掌握「取哪些列、从哪取、怎么筛、怎么排」四个动作，就能完成 80% 的日常查询。",
      questions: [
        {
          id: "db-2-q1",
          prompt: "查询学生表中所有列，正确写法是？",
          options: ["`GET * FROM students`", "`SELECT * FROM students`", "`FETCH students`", "`SELECT students`"],
          answer: 1,
          explanation: "`SELECT 列 FROM 表`；`*` 表示所有列。注意关键字是 SELECT 不是 GET/FETCH。",
        },
        {
          id: "db-2-q2",
          prompt: "只要 score 大于 80 的行，应该加哪个子句？",
          options: ["`HAVING score > 80`", "`WHERE score > 80`", "`FILTER score > 80`", "`ORDER BY score > 80`"],
          answer: 1,
          explanation:
            "WHERE 过滤行；HAVING 是给 GROUP BY 之后的分组结果过滤的——初学最常见的混淆点。",
        },
        {
          id: "db-2-q3",
          prompt: "按 score 从高到低排序，写法是？",
          options: ["`SORT score DESC`", "`ORDER BY score DESC`", "`RANK score DESC`", "`ORDER BY score ASC`"],
          answer: 1,
          explanation: "`ORDER BY 列 [ASC|DESC]`，ASC 升序（默认）、DESC 降序。",
        },
        {
          id: "db-2-q4",
          prompt: "模糊匹配「姓张的学生」，WHERE 条件应写？",
          options: ["`name = '张%'`", "`name LIKE '张%'`", "`name == '张*'`", "`name MATCH '张?'`"],
          answer: 1,
          explanation:
            "LIKE 做模式匹配：`%` 任意长度通配、`_` 单字符。`'张%'` 即「张开头的任意字符串」。",
        },
        {
          id: "db-2-q5",
          prompt: "只取成绩前 3 名，MySQL/PostgreSQL 的常见写法组合是？",
          options: [
            "`SELECT TOP 3`（所有数据库通用）",
            "`ORDER BY score DESC LIMIT 3`",
            "`WHERE rank <= 3`",
            "`FIRST 3 FROM students`",
          ],
          answer: 1,
          explanation:
            "`LIMIT 3` 适用于 MySQL/PostgreSQL/SQLite；SQL Server 用 `TOP 3`——方言差异是查文档的日常。",
        },
        {
          id: "db-2-q6",
          prompt: "`SELECT name, score FROM students WHERE class = 'A'` 返回的结果是？",
          options: [
            "A 班所有列",
            "A 班学生的姓名和成绩两列",
            "全表学生的姓名",
            "语法错误",
          ],
          answer: 1,
          explanation:
            "SELECT 后的列清单决定「输出哪些列」，WHERE 决定「输出哪些行」——两个维度独立控制。",
        },
        {
          id: "db-2-q7",
          prompt: "统计每个班的人数，正确的关键词组合是？",
          options: [
            "`SELECT class, COUNT(*) FROM students GROUP BY class`",
            "`SELECT class, COUNT(*) FROM students ORDER BY class`",
            "`SUM(students) BY class`",
            "`COUNT class FROM students`",
          ],
          answer: 0,
          explanation:
            "GROUP BY 把行按班级分组，COUNT(*) 对每组计数。聚合函数（COUNT/SUM/AVG）几乎总是与 GROUP BY 搭档。",
        },
      ],
    },
    {
      id: "db-3",
      type: "minigame",
      title: "SQL 查询拼装",
      intro:
        "每个查询目标对应一套乱序的 SQL 子句。按正确的书写顺序点击片段，拼出完整的查询语句——子句顺序是 SQL 的语法契约。",
      game: "sql-builder",
      config: {
        puzzles: [
          {
            goal: "查询所有学生的姓名和成绩",
            fragments: ["FROM students", "SELECT name, score"],
            answer: [1, 0],
            finalSql: "SELECT name, score FROM students;",
          },
          {
            goal: "查询 A 班中成绩大于 80 的学生姓名，按成绩从高到低排列",
            fragments: ["WHERE class = 'A' AND score > 80", "ORDER BY score DESC", "FROM students", "SELECT name"],
            answer: [3, 2, 0, 1],
            finalSql:
              "SELECT name FROM students WHERE class = 'A' AND score > 80 ORDER BY score DESC;",
          },
          {
            goal: "统计每个班的学生人数，只看人数超过 30 的班",
            fragments: ["GROUP BY class", "HAVING COUNT(*) > 30", "FROM students", "SELECT class, COUNT(*)"],
            answer: [3, 2, 0, 1],
            finalSql:
              "SELECT class, COUNT(*) FROM students GROUP BY class HAVING COUNT(*) > 30;",
          },
        ],
      },
    },
    {
      id: "db-4",
      type: "quiz",
      title: "关系与连接",
      intro:
        "一张表装不下真实世界：学生、课程、选课记录是三张表。外键让它们产生关系，JOIN 让它们重聚。",
      questions: [
        {
          id: "db-4-q1",
          prompt: "选课记录表里有 `student_id` 指向学生表的主键，这个列叫？",
          options: ["主键", "外键（Foreign Key）", "索引", "视图"],
          answer: 1,
          explanation:
            "外键 = 「引用另一张表主键的列」，数据库借此保证引用完整性：引用的学生必须真实存在。",
        },
        {
          id: "db-4-q2",
          prompt: "「一个学生可以选多门课，一门课可以被多个学生选」是什么关系？",
          options: ["一对一", "一对多", "多对多", "多对一"],
          answer: 2,
          explanation:
            "多对多需要第三张「中间表」（选课记录表）来承载，表里各存对两侧的外键——这是关系建模的核心套路。",
        },
        {
          id: "db-4-q3",
          prompt: "`INNER JOIN` 的结果是？",
          options: [
            "两张表所有行的自由组合",
            "只保留两表中连接条件都匹配的行",
            "左表全部 + 右表匹配部分",
            "两表相加的行数",
          ],
          answer: 1,
          explanation:
            "INNER JOIN = 交集：连接键两边都存在才出现在结果里。要保留一侧全部行则用 LEFT/RIGHT JOIN。",
        },
        {
          id: "db-4-q4",
          prompt: "想列出「所有学生，包括从没选过课的」，应该用？",
          options: [
            "`INNER JOIN`",
            "`LEFT JOIN`（以学生表为左表）",
            "`CROSS JOIN`",
            "`UNION ALL`",
          ],
          answer: 1,
          explanation:
            "LEFT JOIN 保留左表全部行，右表无匹配时填 NULL——「没有选课记录」的学生正是靠 NULL 行现身的。",
        },
        {
          id: "db-4-q5",
          prompt: "JOIN 时若两表都有 `name` 列，引用时应写？",
          options: [
            "直接写 name，数据库自动猜",
            "`students.name` 或用表别名限定",
            "只能改列名后重连",
            "JOIN 里不允许同名列",
          ],
          answer: 1,
          explanation:
            "限定名 `表.列` 消除歧义，实践中常给表起别名：`FROM students s JOIN courses c ON ...` 然后 `s.name`。",
        },
        {
          id: "db-4-q6",
          prompt: "「引用完整性」被破坏的情形是？",
          options: [
            "选课记录里出现一个不存在的学生 id",
            "学生姓名重复",
            "查询返回 NULL",
            "表的数据量很大",
          ],
          answer: 0,
          explanation:
            "孤儿记录（引用了不存在的主键）是完整性破坏的典型。外键约束让数据库直接拒绝这种写入。",
        },
        {
          id: "db-4-q7",
          prompt: "为什么「把所有数据塞进一张大宽表」通常是不好的设计？",
          options: [
            "查询会变慢（唯一原因）",
            "同一事实大量重复存储，更新时容易不一致（违反规范化）",
            "数据库有表数量上限",
            "会占用更多主键",
          ],
          answer: 1,
          explanation:
            "规范化（Normal Form）的核心动机：每个事实只存一份。学生电话改了要改 1000 行 vs 改 1 行——冗余是不一致的温床。",
        },
      ],
    },
    {
      id: "db-5",
      type: "minigame",
      title: "数据库概念配对",
      intro:
        "把左列的数据库概念与右列它们的职责配对。全部配对正确且少失误，才能点亮三颗星。",
      game: "matching",
      config: {
        pairs: [
          { left: "主键 Primary Key", right: "唯一标识一行，非空不重复" },
          { left: "外键 Foreign Key", right: "引用另一张表的主键，保证引用存在" },
          { left: "索引 Index", right: "像书的目录，加速按条件查找" },
          { left: "事务 Transaction", right: "一组操作要么全部成功要么全部回滚" },
          { left: "GROUP BY", right: "把行按列值分组，配合聚合函数统计" },
          { left: "LEFT JOIN", right: "保留左表全部行，右表无匹配填 NULL" },
        ],
      },
    },
    {
      id: "db-6",
      type: "quiz",
      title: "索引与事务",
      intro:
        "百万行数据为什么毫秒返回？转账为什么不会扣了钱没到账？索引与事务是数据库可靠与高效的两大支柱。",
      questions: [
        {
          id: "db-6-q1",
          prompt: "索引加速查询的原理是？",
          options: [
            "把数据复制了一份",
            "用 B+ 树等结构维护有序映射，把全表扫描变成对数级查找",
            "让硬盘转得更快",
            "压缩了数据",
          ],
          answer: 1,
          explanation:
            "没有索引要逐行比对（O(n)）；索引像有序目录（B+ 树，O(log n)）直达目标——代价是占额外空间、拖慢写入。",
        },
        {
          id: "db-6-q2",
          prompt: "「索引不是越多越好」的主要原因是？",
          options: [
            "索引会失效",
            "每次写入都要同步更新所有索引，拖慢 INSERT/UPDATE",
            "索引需要手动维护",
            "索引只能建一个",
          ],
          answer: 1,
          explanation:
            "索引是典型的读快写慢权衡：读多写少的列值得建，频繁更新的表要节制。为查询模式设计索引，而不是给每列都建。",
        },
        {
          id: "db-6-q3",
          prompt: "转账「A 扣 100 元、B 加 100 元」必须放在一个事务里，因为？",
          options: [
            "这样速度更快",
            "两步要么都成功要么都回滚，不会出现钱凭空消失的中间态",
            "数据库要求每个语句都在事务里",
            "可以少写代码",
          ],
          answer: 1,
          explanation: "这就是原子性（Atomicity）：中间态对外不可见。只扣不加的瞬间就是资金事故。",
        },
        {
          id: "db-6-q4",
          prompt: "ACID 中的 I 指？",
          options: ["Index", "Isolation（并发事务互不干扰）", "Integrity", "Interface"],
          answer: 1,
          explanation:
            "A 原子性、C 一致性、I 隔离性、D 持久性。隔离性决定并发事务能看到彼此多少中间状态（隔离级别）。",
        },
        {
          id: "db-6-q5",
          prompt: "「两个事务同时读同一行、各自加一并写回，少了一次加」是什么问题？",
          options: ["脏读", "丢失更新（需要锁或原子 UPDATE 解决）", "死锁", "幻读"],
          answer: 1,
          explanation:
            "读-改-写不是原子操作，并发下互相覆盖。用行锁、或 `UPDATE ... SET x = x + 1` 让加法在库内原子完成。",
        },
        {
          id: "db-6-q6",
          prompt: "`EXPLAIN` 命令的作用是？",
          options: [
            "解释报错信息",
            "显示查询执行计划（用没用索引、扫描多少行）",
            "导出建表语句",
            "解释数据含义",
          ],
          answer: 1,
          explanation:
            "查询慢的第一步是 EXPLAIN：看它走没走索引、扫了多少行。优化 SQL 靠证据，不靠玄学。",
        },
        {
          id: "db-6-q7",
          prompt: "数据库「持久性（Durability）」由什么保证？",
          options: [
            "内存缓存",
            "预写日志（WAL）：先记日志再改数据，崩溃后可重放恢复",
            "定期重启",
            "程序员手动保存",
          ],
          answer: 1,
          explanation:
            "提交成功的数据即使断电也不能丢——WAL/redo log 先落盘，宕机重启后重放日志恢复到一致状态。SQLite 也用这套机制。",
        },
      ],
    },
  ],
};
