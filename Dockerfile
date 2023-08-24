FROM node:20-slim AS base

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

USER node

RUN mkdir -p profiles/

CMD ["node", "betterafk.js"]