# Этап 1: Сборка
FROM node:20-alpine AS builder
# Почему Alpine? Минимальный размер Linux (5MB vs 900MB Ubuntu)

WORKDIR /app
# Создаём рабочую папку в контейнере

COPY package*.json ./
RUN npm ci --only=production
# Сначала копируем только package.json для кеширования

COPY . .
RUN npm run build
# Собираем проект

# Этап 2: Production
FROM node:20-alpine
# Новый чистый образ

# Тут хитрость с Doppler - устанавливаем его
RUN apk add --no-cache curl
RUN curl -Ls https://cli.doppler.com/install.sh | sh

WORKDIR /app
COPY --from=builder /app/dist ./dist
# Копируем ТОЛЬКО готовую сборку

# Запуск через Doppler
CMD ["doppler", "run", "--", "npx", "serve", "dist", "-p", "3000"]