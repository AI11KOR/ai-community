FROM node:20-alpine
WORKDIR /app

# ← 이거 추가! OpenSSL 1.1 설치
RUN apk add --no-cache openssl openssl-dev

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY . .

RUN npm run build
RUN npx prisma generate

ENV PORT=8008
EXPOSE 8008

CMD ["node", "dist/index.js"]