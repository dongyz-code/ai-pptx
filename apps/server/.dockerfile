FROM node:20-alpine as base

FROM base as deps
WORKDIR /app
ENV LANG C.UTF-8
RUN sed -i 's/dl-cdn.alpinelinux.org/mirror.tuna.tsinghua.edu.cn/g' /etc/apk/repositories
# 时区
RUN apk add tzdata 
ENV TZ=Asia/Shanghai
# install dependencies
RUN apk add --no-cache libc6-compat
RUN apk add icu-data-full
COPY package*.json ./
RUN npm i --omit-dev --registry https://registry.npmmirror.com

FROM deps AS builder
WORKDIR /app
COPY . .
RUN npm run build
CMD ["node", "--max-old-space-size=16000", "dist/main.js"]
EXPOSE 3000