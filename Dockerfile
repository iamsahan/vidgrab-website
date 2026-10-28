# syntax=docker/dockerfile:1

# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /app

# Build-time configuration (read by lib/site.ts and next.config.ts during static export)
ARG SITE_URL=""
ARG PAGES_BASE_PATH=""
ENV SITE_URL=$SITE_URL \
    PAGES_BASE_PATH=$PAGES_BASE_PATH \
    NEXT_TELEMETRY_DISABLED=1

# Install exactly what the lock file says
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Writes the static site to /app/out
RUN npm run build

# ---- runtime stage ----
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

COPY --from=build /app/out /usr/share/nginx/html

# Unprivileged nginx listens on 8080 and runs as the non-root nginx user (uid 101)
EXPOSE 8080
USER 101
