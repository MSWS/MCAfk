FROM node:20-slim AS base

WORKDIR /usr/src/app

RUN mkdir -p /profiles
RUN chown -R node:node /profiles

COPY package*.json ./
RUN npm install --only=production

COPY . .

USER node

CMD ["node", "betterafk.js"]