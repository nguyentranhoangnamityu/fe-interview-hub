FROM node:20-bookworm-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages

ARG VITE_API_URL=http://localhost:4000/api
ENV VITE_API_URL="${VITE_API_URL}"

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @fehub/admin build

FROM nginx:1.27-alpine

COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html

EXPOSE 80
