FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# ORM prisma 사용
COPY prisma ./prisma
RUN nxp prisma generate

ENV PORT=8008
EXPOSE 8008

CMD ["npm", "start"]