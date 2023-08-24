FROM node:20-slim AS base

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

USER node

CMD ["node", "betterafk.js"]