# 依赖安装阶段
FROM node:20-slim AS deps
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖描述文件
COPY package.json pnpm-lock.yaml ./

# 只安装生产环境依赖
RUN pnpm install --prod


# 构建阶段
FROM node:20-slim AS builder
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制所有依赖描述文件
COPY package.json pnpm-lock.yaml ./

# 安装所有依赖
RUN pnpm install

# 复制项目源码
COPY . .

# 在构建时提供虚拟的环境变量
ENV GEMINI_API_KEY="DUMMY_KEY_FOR_BUILD"
ENV GEMINI_IMAGE_MODEL="gemini-2.5-flash-image"
ENV GEMINI_TEXT_MODEL="gemini-2.5-flash"
ENV GEMINI_BASE_URL=""

# 构建项目
RUN pnpm build


# 运行阶段
FROM node:20-alpine AS runner
WORKDIR /app

# 创建一个非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制独立输出的构建结果
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# 复制 public 目录
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# 复制 .next/static 目录
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 设置用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV PORT=3000
ENV GEMINI_API_KEY="YOUR_API_KEY_HERE"
ENV GEMINI_IMAGE_MODEL="gemini-2.5-flash-image"
ENV GEMINI_TEXT_MODEL="gemini-2.5-flash"
ENV GEMINI_BASE_URL=""

# 启动命令
CMD ["node", "server.js"]