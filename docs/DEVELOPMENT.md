# CodeQuest 开发文档

> 面向本项目的开发者与内容贡献者。快速上手见根目录 [README](../README.md)，本文深入架构、机制与约定。

## 1. 项目概述

CodeQuest 是一个通过闯关游戏学习计算机基础知识的网站。核心玩法循环：

```
选择大陆(主题) → 闯关(答题 / 互动小游戏) → 即时解析 → 星星结算 → XP 入排行榜 → 解锁下一关
```

设计原则（按优先级）：

1. **内容即数据**：主题/关卡/题库是纯 TypeScript 数据文件，扩展内容不改业务代码
2. **服务端权威**：星星与 XP 一律由服务端计算，客户端只提交原始作答，排行榜可信
3. **零运维持久化**：SQLite 单文件 + 启动自动迁移，部署 = 一个容器 + 一个卷
4. **性能预算**：内容页静态化、小游戏按关卡代码分割、不下载 webfont

## 2. 技术栈

| 层 | 选型 | 版本基准 | 选型理由 |
|---|---|---|---|
| 框架 | Next.js (App Router, Turbopack) | 16 | 前后端一体；RSC 让内容页零客户端 JS；standalone 产物适配 Docker |
| UI | React + Tailwind CSS v4 + motion | 19 / 4 / 14 | v4 零配置主题令牌；motion 做结算/星星动效 |
| 状态 | Zustand | 5 | 单 store 管游戏会话，避免引入重状态库 |
| 认证 | better-auth | 1.x | 邮箱密码开箱即用，官方 Drizzle 适配器，类型安全 |
| ORM/DB | Drizzle ORM + SQLite (@libsql/client) | 0.45 | 类型安全 SQL；单文件零运维；日后迁 PostgreSQL 只改 dialect |
| 测试 | Vitest | 5 | 快；纯函数逻辑全部可测 |
| 包管理 | pnpm | 12 | workspace 设置在 pnpm-workspace.yaml |

## 3. 系统架构

```
┌─────────────────────────── 浏览器 ───────────────────────────┐
│  RSC 页面(静态/SSR)          客户端组件                       │
│  /  /learn  /leaderboard     QuizEngine / 8×小游戏 / ResultScreen │
│                              │ submitProgress()                │
└──────────────────────────────┼─────────────────────────────────┘
                               │ POST /api/progress (原始作答)
┌──────────────────────────────▼─────────────────────────────────┐
│ Next.js 服务端                                                  │
│  scoring.ts ── 服务端权威计分（星/XP）                           │
│  progress-rules.ts ── 解锁校验（防跳关刷分）                     │
│  auth.ts (better-auth) ── 会话 / api/progress / api/leaderboard │
│  instrumentation.ts ── 启动时自动 drizzle 迁移                  │
└──────────────────────────────┬─────────────────────────────────┘
                               │ Drizzle ORM
                        ┌──────▼──────┐
                        │ SQLite 单文件 │  Docker 卷 /data
                        └─────────────┘
```

**内容与代码的边界**：`src/content/` 只有数据与类型，`src/components/`、`src/lib/` 是通用引擎。两者通过 `registry.ts` 连接。

## 4. 目录结构

```
cs-quest/
├── src/
│   ├── app/
│   │   ├── (main)/            # 带页头页脚的页面组
│   │   │   ├── page.tsx       #   首页（静态）
│   │   │   ├── learn/         #   闯关地图（SSR，读进度）
│   │   │   ├── leaderboard/   #   排行榜（SSR，force-dynamic）
│   │   │   └── profile/       #   个人中心（登录后）
│   │   ├── (auth)/            # 登录/注册（静态）
│   │   ├── play/[levelId]/    # 关卡页（全屏沉浸，LevelClient 分发）
│   │   ├── api/
│   │   │   ├── auth/[...all]/ # better-auth 处理器
│   │   │   ├── progress/      # GET 进度 / POST 上报成绩
│   │   │   └── leaderboard/   # Top100 + 我的排名
│   │   └── layout.tsx         # 根布局 + metadata
│   ├── components/
│   │   ├── game/              # 通用引擎：QuizEngine、ResultScreen、CodeInline
│   │   ├── games/             # ★ 12 个小游戏组件（每游戏一文件 + shared.ts 收尾）
│   │   ├── ui/                # Button / Stars / ProgressBar / Badge
│   │   ├── layout/            # SiteHeader / SiteFooter
│   │   └── auth/              # AuthForm
│   ├── content/               # ★ 内容层（扩展主要动这里）
│   │   ├── types.ts           # 全部类型：Theme/Level/Question/MiniGameConfigs
│   │   ├── registry.ts        # THEMES 数组 + findLevel/nextLevelOf
│   │   └── themes/            # binary / cpu / os / network / algorithms / database / webdev / security
│   └── lib/
│       ├── db/schema.ts       # Drizzle 表定义
│       ├── db/client.ts       # libsql 客户端（自动建目录）
│       ├── auth.ts            # better-auth 服务端配置
│       ├── auth-client.ts     # 浏览器端 auth 客户端
│       ├── scoring.ts         # 服务端计分纯函数
│       ├── progress-rules.ts  # 解锁规则纯函数
│       └── game-store.ts      # Zustand 会话 + submitProgress
├── tests/                     # Vitest（计分/解锁/调度/逆序对/题库完整性）
├── drizzle/                   # 迁移 SQL（提交进 git）
├── docs/                      # 本文档
├── Dockerfile                 # 多阶段构建 → standalone
└── docker-compose.yml         # 单服务 + named volume
```

## 5. 数据模型

| 表 | 用途 | 关键列 |
|---|---|---|
| `user` / `session` / `account` / `verification` | better-auth 标准表 | — |
| `level_progress` | 每用户每关卡最佳成绩 | `userId+levelId` 唯一索引、`stars`、`bestScore`、`timesPlayed` |
| `user_stats` | 聚合统计（排行榜直接读） | `totalXp`、`levelsCleared`、`totalStars`、`achievements(json)` |

设计要点：

- **星（0~3）是唯一事实**：`level_progress.stars > 0` 即视为通关，解锁规则全靠它推导，不存冗余的"已解锁"标记
- **user_stats 是增量聚合**：POST /api/progress 在同一事务路径里用 `onConflictDoUpdate` 累加，排行榜查询零聚合计算
- **重复通关只留最高星，XP 不重复发放**（首通才加 XP，升星只更新 stars）

## 6. 核心机制

### 6.1 计分（src/lib/scoring.ts，服务端专用）

| 类型 | 通关线 | ★1 | ★2 | ★3 | XP |
|---|---|---|---|---|---|
| quiz | 正确率 ≥60% | ≥60% | ≥75% | ≥90% | 答对数×5 + 星×10 |
| minigame | 表现分 ≥50/100 | ≥50 | ≥75 | ≥90 | 15 + 星×10 |

小游戏把玩法结果折算成 0~100 的 `performance`（各游戏自定义折算，见各组件），计分函数统一评星。

### 6.2 解锁（src/lib/progress-rules.ts，纯函数双端共用）

- 主题内：顺序解锁（通关第 N 关开第 N+1 关）
- 主题间：上一主题通关 ≥80%（`Math.ceil(levels × 0.8)`）开下一主题
- 每主题第 1 关免登录可玩（`isFreePlayLevel`），游客成绩不入库

### 6.3 结算上报时序（本轮 GUI 测试后确立的模式）

```
最后一题/游戏完成
  → 本地 scoreLevel() 算出星级（用于立即展示）
  → setResult(...)  先切结算屏（乐观 UI，不等待网络）
  → await submitProgress()  异步上报（8s 超时）
  → 失败则把 saveState 更新为 "error"（结算屏显示"保存失败，重玩可补记"）
```

> ⚠️ 新代码不要在 `await submitProgress()` 之前不渲染任何东西——实测网络挂起会让结算 UI 永久卡住。相关缺陷修复见 git 历史 "结算乐观 UI"。

### 6.4 防作弊

- 星/XP 只能由服务端算：客户端提交的是 `answers[]` 或 `performance` 原始数据
- 提交时校验关卡解锁状态（跳关提交返回 403）
- 未登录提交返回 401；`performance` 钳制在 0~100
- 剩余弱点（路线图）：无提交频率限制、无答案防爬

## 7. 内容创作指南

### 7.1 新增一个主题（新大陆）Checklist

1. 新建 `src/content/themes/<id>.ts`，导出 `Theme` 对象
2. `registry.ts` 的 `THEMES` 数组加入（顺序 = 解锁顺序 = 首页展示顺序）
3. 跑 `pnpm test` —— 题库完整性测试会自动校验：
   - 关卡 id 全局唯一
   - 每题 options ≥2、answer 下标合法、explanation 非空
   - quiz 每关 6~10 题
   - minigame 的 game id 已在引擎注册

**出题规范**：题干中行内代码用反引号（渲染为等宽青色）；解析要教"为什么"而非复述答案；每关最后一个 quiz 关命名为「大陆结算 · XX」作为验收。

### 7.2 新增一个互动小游戏

1. `src/content/types.ts` 的 `MiniGameConfigs` 加配置类型（配置必须是**纯数据**，可序列化）
2. 新建 `src/components/games/MyGame.tsx`，实现 `MiniGameProps`：
   ```tsx
   export default function MyGame({ level, nextLevelId, authed, onFinish }: MiniGameProps) {
     // 玩法结束后：
     void finishMiniGame({ level, nextLevelId, authed, onFinish }, performance /* 0~100 */);
   }
   ```
   - `finishMiniGame`（games/shared.ts）统一处理：本地评星 → 乐观结算 → 异步上报，不要自己写提交逻辑
   - 失败路径传 `performance < 50` 即可，结算屏会显示"还差一点点"
3. `src/app/play/[levelId]/LevelClient.tsx` 的 `MINI_GAMES` 注册表加一行 `dynamic(() => import(...))`（自动代码分割）
4. 在主题文件里引用 `{ type: "minigame", game: "my-game", config: {...} }`

**玩法设计经验**（来自已上线 12 个游戏）：
- 核心计算抽成纯函数放组件旁（如 `scheduler-logic.ts`、`sort-logic.ts`），可单测
- 失败/失误规则要容忍"中间态"——玩家调整过程中途不应被惩罚（见 BinaryBulbs 的修正历史）
- 用 aria-label 暴露权重/含义，既是可访问性也是自动化测试的定位锚点

### 7.3 新增小游戏时的结算折算参考

| 模式 | performance 折算 |
|---|---|
| 完成型（排序/握手/子网） | 正确率或与理论最优的比值 ×100 |
| 步数型（二分/灯泡） | 100 − 失误/多余步数 × 罚分，下限 50 |
| 对抗型（调度） | 最优值 / 玩家值 ×100，≥90 视为掌握 |

## 8. API 参考

### `POST /api/progress`

```jsonc
// 请求（需登录 cookie）
{ "levelId": "binary-1", "submission": { "kind": "quiz", "answers": [1,0,1,1,1,0,1] } }
// 或
{ "levelId": "binary-2", "submission": { "kind": "minigame", "performance": 95 } }

// 200
{ "passed": true, "stars": 3, "xpGained": 65, "newRecord": true }
// 未通过时不入库：{ "passed": false, "stars": 0, "xpGained": 0 }
// 401 未登录 | 403 关卡未解锁 | 404 关卡不存在
```

### `GET /api/progress`

`{ "progress": { "binary-1": 3, ... }, "stats": { totalXp, levelsCleared, totalStars, achievements } }`

### `GET /api/leaderboard`

`{ "top": [{ userId, name, totalXp, levelsCleared, totalStars }], "me": { rank, totalXp } | null }`

## 9. 开发工作流

```bash
pnpm install
pnpm db:generate      # 改了 schema.ts 后生成迁移
pnpm db:migrate       # 应用迁移（dev 时 instrumentation 也会自动应用）
pnpm dev              # http://localhost:3000
pnpm test             # Vitest
pnpm build            # 生产构建（含 TS 全量类型检查，会检查 tests/）
```

**Windows 注意事项**（本机实测）：

- 便携版 Node 在 `$LOCALAPPDATA/Programs/nodejs`，PATH 写在 `~/.bashrc`，新开 Git Bash 自动生效
- dev server 卡死时先 `netstat -ano | findstr :3000` 找 PID 再 `Stop-Process -Id <pid> -Force`，并删除 `.next/dev/`（锁目录）
- 本机代理工具可能造成浏览器侧 fetch 间歇性 `Failed to fetch`（服务端 curl 正常）——应用层已做 8s 超时 + 乐观结算兜底，遇到时重试即可，不要误判为应用 bug
- `next.config.ts` 改动会触发 dev 自动重启，重启窗口期的请求会失败

**代码约定**：

- 服务端可信逻辑（计分/解锁）必须是纯函数并写单测；组件只做编排与渲染
- 客户端组件文件顶部 `"use client"`；服务端专用模块不要加
- 样式用 `@theme` 设计令牌（globals.css），组件类用 `@layer components` 里定义的 `.btn-neon/.card/.input` 等，不写裸色值
- 中文文案，题干/解析中代码用反引号包裹

## 10. 测试策略

| 层 | 工具 | 覆盖 |
|---|---|---|
| 纯函数单测 | Vitest | scoring（星/XP/边界）、progress-rules（解锁矩阵）、scheduler/sort 逻辑、题库完整性扫描 |
| API 集成 | curl（dev server） | 注册/上报/防作弊（401/403/重复提交不重复计分）|
| GUI 黑盒 | 浏览器自动化（ZCode IAB） | 全用户旅程：注册→地图→答题→小游戏→排行榜→个人中心→错误反馈 |

GUI 测试证据在 `gui-test-screenshots/`（git 忽略）。GUI 测试经验：IAB 下 Playwright locator click 可能因帧稳定性超时，`locator.fill` 与 `dom_cua.click`（按 `get_visible_dom()` 的 ref）是可靠替代；元素的 `aria-label`/文本是定位事实的唯一来源。

## 11. 部署与运维

部署细节（nginx 反代、备份）见 [README](../README.md)。补充：

- **升级流程**：`git pull && docker compose up -d --build`，启动时 `instrumentation.ts` 自动应用新迁移，无需手动步骤
- **迁移纪律**：改 `schema.ts` → `pnpm db:generate` → 提交 `drizzle/` 下的 SQL → 部署
- **数据安全**：SQLite 卷建议低峰期冷备（README 有脚本）；未来多写场景迁 Litestream 或 PostgreSQL（Drizzle 只改 dialect 与连接串）
- **环境变量**：`DATABASE_URL` / `BETTER_AUTH_SECRET`（必填）/ `BETTER_AUTH_URL`，见 `.env.example`

## 12. 路线图

- [ ] 更多主题：编程语言、数据库、Web 开发、信息安全
- [ ] OAuth 登录（better-auth socialProviders）
- [ ] 每日挑战 + 连续学习 streak
- [ ] 提交频率限制与题库防爬
- [ ] 成就持久化计算（当前 profile 页实时推导）

## 13. 故障排查 FAQ

**Q: 结算屏显示"成绩保存失败"？**
POST /api/progress 未成功（网络/超时）。重玩该关即可补记；服务端重复提交不重复计分，无需担心。

**Q: 注册/登录报"网络异常"？**
better-auth 客户端 fetch 被网络层拒绝。确认 dev server 存活与代理设置；生产环境检查 `BETTER_AUTH_URL` 与反代的 `X-Forwarded-Proto`。

**Q: 测试里 `dnf`/评分对不上？**
计分是服务端权威：先查 POST 是否到达（dev server 日志有 `POST /api/progress`），再查提交的 `answers` 是否按题目下标。

**Q: 构建报 tests/ 类型错误？**
`next build` 会全量类型检查（含 tests/）。保持 mock 数据符合 `MiniGameConfigs` 的形状。
