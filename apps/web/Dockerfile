FROM node:20-bookworm-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages

ARG VITE_API_BASE_URL=http://localhost:4000/api
ARG VITE_GOOGLE_CLIENT_ID=

ENV VITE_API_BASE_URL="${VITE_API_BASE_URL}"
ENV VITE_GOOGLE_CLIENT_ID="${VITE_GOOGLE_CLIENT_ID}"

RUN pnpm install --frozen-lockfile
RUN pnpm --filter web build

FROM nginx:1.27-alpine

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80
