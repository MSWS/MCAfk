FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
COPY betterafk.js ./

RUN npm install

COPY . .

CMD ["node", "betterafk.js"]