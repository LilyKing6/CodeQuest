# CodeQuest · 游戏化学计算机

通过闯关游戏学习计算机基础知识：答题 + 互动小游戏混合模式，涵盖**二进制与逻辑门、CPU 与内存、操作系统、计算机网络、算法入门、数据库与 SQL、Web 开发、信息安全**八大主题，44 个关卡（含 14 个互动小游戏实例）。

![技术栈](https://img.shields.io/badge/Next.js_16-React_19-Tailwind_v4-8b5cf6) ![DB](https://img.shields.io/badge/SQLite-Drizzle_ORM-22d3ee) ![Auth](https://img.shields.io/badge/better--auth-邮箱注册-34d399)

> 📖 架构设计、核心机制、内容创作指南与 API 细节见 **[开发文档](docs/DEVELOPMENT.md)**。

## 功能

- 🎮 **混合式玩法**：每关是问答（即时解析）或互动小游戏（拨灯泡学二进制、步进 CPU 模拟器、排进程调度、完成 TCP 握手、划分子网、二分猜数、冒泡排序……）
- ⭐ **星星与 XP**：按正确率/操作表现评 1~3 星，服务端权威计分，排行榜防作弊
- 🗺️ **顺序解锁**：关卡内顺序解锁，一片大陆通关 80% 开启下一片
- 🏆 **排行榜 / 个人中心 / 成就墙**
- 👀 **游客可玩**：每个主题第一关免登录体验
- 🐳 **一键部署**：单容器 + SQLite 卷，启动自动迁移

## 本地开发

要求 Node 22+、pnpm 10+。

```bash
pnpm install
cp .env.example .env.local   # 填好 BETTER_AUTH_SECRET（openssl rand -base64 32）
pnpm db:migrate              # 生成/应用迁移（首次已生成在 drizzle/）
pnpm dev                     # http://localhost:3000
```

其他命令：

```bash
pnpm test        # Vitest 单测（计分/解锁/调度/逆序对/题库完整性）
pnpm build       # 生产构建
pnpm db:studio   # Drizzle Studio 查看数据
```

## 服务器部署（Docker）

```bash
# 1. 准备环境变量
cat > .env <<'EOF'
BETTER_AUTH_SECRET=<openssl rand -base64 32 的输出>
BETTER_AUTH_URL=https://你的域名
EOF

# 2. 构建并启动（数据库存在 named volume 中，持久化）
docker compose up -d --build
```

启动时自动应用数据库迁移（`src/instrumentation.ts`），无需手动步骤。

### nginx 反代示例

```nginx
server {
    listen 443 ssl http2;
    server_name 你的域名;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 数据备份

SQLite 单文件备份很简单。日常推荐**冷备**（先停应用，几秒即可）：

```bash
docker compose stop cs-quest
docker run --rm -v cs-quest_cs-quest-data:/data -v "$PWD":/backup alpine \
  cp /data/cs-quest.db /backup/cs-quest-$(date +%F).db
docker compose start cs-quest
```

要求零停机可用 [Litestream](https://litestream.io/) 挂载同卷做实时复制，或在低峰期用上面的脚本配合 crontab 定时备份。

## 架构与扩展指南

> 完整版见 [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)，以下为速览。

```
src/
├── app/                  # 路由（(main) 带页头页脚；(auth) 登录注册；play/ 全屏关卡）
├── components/
│   ├── game/             # QuizEngine（答题引擎）、ResultScreen（结算）、关卡页
│   ├── games/            # ★ 12 个互动小游戏组件（每游戏一个文件）
│   ├── ui/               # Button / Stars / ProgressBar / Badge
│   └── layout/           # 页头页脚
├── content/              # ★ 内容即数据（扩展主要动这里）
│   ├── types.ts          # 主题/关卡/题库/小游戏配置的全部类型
│   ├── registry.ts       # 主题注册表（THEMES 数组，顺序即解锁顺序）
│   └── themes/           # 8 个主题题库文件
└── lib/
    ├── db/               # Drizzle schema + 客户端（SQLite）
    ├── auth.ts           # better-auth 配置
    ├── scoring.ts        # 服务端权威计分（星星/XP）
    ├── progress-rules.ts # 解锁规则（纯函数）
    └── game-store.ts     # Zustand 游戏会话
```

### ➕ 添加一个新主题（新大陆）

1. 新建 `src/content/themes/my-theme.ts`，照抄 `binary.ts` 的结构，填入 quiz 关卡与小游戏关卡
2. 在 `src/content/registry.ts` 的 `THEMES` 数组中加入它
3. 完成。地图、解锁、排行榜、个人中心自动适配

### ➕ 添加一个互动小游戏类型

1. 新建 `src/components/games/MyGame.tsx`，实现 `MiniGameProps` 接口
   （游戏结束时调用 `finishMiniGame(props, performance0~100)` 即可接入结算/上报/评星）
2. 在 `src/app/play/[levelId]/LevelClient.tsx` 的 `MINI_GAMES` 注册表加一行 `dynamic(() => import(...))`
3. 在 `src/content/types.ts` 的 `MiniGameConfigs` 中加上你的配置类型
4. 在主题文件里引用 `game: "my-game"`

### 计分规则

- quiz：正确率 ≥60% 通关（1★），≥75% 2★，≥90% 3★；XP = 答对数×5 + 星×10
- 小游戏：表现分 ≥50 通关（1★），≥75 2★，≥90 3★；XP = 15 + 星×10
- 重复通关只保留最高星，XP 不重复发放（服务端 `level_progress` + `user_stats` 保证）

## 环境变量

| 变量 | 说明 | 默认 |
|---|---|---|
| `DATABASE_URL` | SQLite 路径（`file:` 开头） | `file:./data/local.db` |
| `BETTER_AUTH_SECRET` | 会话签名密钥，**必填** | — |
| `BETTER_AUTH_URL` | 对外访问地址 | `http://localhost:3000` |

## 后续路线

- [ ] 更多主题：编程语言、编译原理、云原生……（`content/themes/` 加文件即可）
- [ ] OAuth 登录（better-auth 的 socialProviders 开箱即用）
- [ ] 每日挑战与连续学习 streak
- [ ] PostgreSQL 迁移（改 drizzle schema 的 dialect + DATABASE_URL）
