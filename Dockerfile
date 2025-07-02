FROM node:24-alpine AS node_base
WORKDIR /app
RUN npm install -g pnpm@latest-10
EXPOSE 3000
ENV PORT=3000
COPY package*.json ./ 

FROM node_base AS node_dev
RUN pnpm install
COPY . .
ENV NODE_ENV=development
CMD ["pnpm", "run", "dev"]