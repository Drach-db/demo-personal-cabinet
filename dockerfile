# Этап 1: Сборка (без изменений)
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache curl gnupg bash
RUN curl -Ls https://cli.doppler.com/install.sh | sh

ARG DOPPLER_TOKEN
ENV DOPPLER_TOKEN=$DOPPLER_TOKEN

COPY package*.json ./
RUN npm ci

COPY . .
RUN doppler run -- npm run build

# Этап 2: Production с nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Копируем сборку
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx слушает на 3000 вместо 80
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]