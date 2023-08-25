FROM node:20-slim AS base

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY . .

USER node

CMD ["node", "betterafk.js"]