FROM node:20-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN corepack enable

WORKDIR /app

FROM base AS deps

# Install workspace dependencies once for all targets
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile

FROM deps AS build-web

ARG VITE_API_BASE_URL=http://localhost:4000/api
ARG VITE_GOOGLE_CLIENT_ID=

ENV VITE_API_BASE_URL="${VITE_API_BASE_URL}"
ENV VITE_GOOGLE_CLIENT_ID="${VITE_GOOGLE_CLIENT_ID}"

RUN pnpm --filter web build

FROM deps AS build-admin

ARG VITE_API_URL=http://localhost:4000/api

ENV VITE_API_URL="${VITE_API_URL}"

RUN pnpm --filter @fehub/admin build

FROM node:20-bookworm-slim AS api

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN corepack enable

WORKDIR /app

COPY --from=deps /pnpm /pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps ./apps
COPY --from=deps /app/packages ./packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

ENV NODE_ENV=production

EXPOSE 4000

CMD ["pnpm", "--filter", "api", "start"]

FROM nginx:1.27-alpine AS web

COPY --from=build-web /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

FROM nginx:1.27-alpine AS admin

COPY --from=build-admin /app/apps/admin/dist /usr/share/nginx/html

EXPOSE 80
