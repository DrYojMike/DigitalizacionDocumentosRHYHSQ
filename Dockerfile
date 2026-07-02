FROM node:22-alpine AS builder

WORKDIR /app

# 🔥 Instalar versión estable
RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm build


FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm@9

COPY --from=builder /app ./

EXPOSE 3001

CMD ["pnpm", "start", "--port", "3001"]