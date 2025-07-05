FROM node:24-alpine AS node_base
WORKDIR /app
EXPOSE 3000
ENV PORT=3000

# Install pnpm
RUN npm install -g pnpm

FROM node_base AS node_dev
# Install PostgreSQL client for pg_isready command and wget for health checks
RUN apk add --no-cache postgresql-client wget

# Configure pnpm store location
ENV PNPM_HOME="/app/.pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm config set store-dir /app/.pnpm-store

# Copy package files first
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .pnpmrc ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

ENV NODE_ENV=development

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["pnpm", "run", "dev"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]