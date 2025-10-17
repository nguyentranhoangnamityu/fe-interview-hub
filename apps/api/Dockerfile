FROM node:20-bookworm-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile

ENV NODE_ENV=production
EXPOSE 4000

CMD ["pnpm", "--filter", "api", "start"]
