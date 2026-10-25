# ---------- 依赖阶段 ----------
FROM node:22-alpine AS deps
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ---------- 构建阶段 ----------
FROM node:22-alpine AS builder
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# 构建期只编译，不连数据库
ENV DATABASE_URL="file:./data/build-placeholder.db"
ENV BETTER_AUTH_SECRET="build-placeholder"
RUN pnpm build

# ---------- 运行阶段 ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV DATABASE_URL=file:/data/cs-quest.db

# 非 root 用户运行
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001

# standalone 产物：只带运行时必需文件，镜像最小
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# drizzle 迁移文件（启动时自动应用）
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/drizzle-orm ./node_modules/drizzle-orm

RUN mkdir -p /data && chown nextjs:nodejs /data
USER nextjs
EXPOSE 3000
VOLUME /data

CMD ["node", "server.js"]
