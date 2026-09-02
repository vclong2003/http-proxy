FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY server.js index.html 429.html ./

EXPOSE 4000

ENV NODE_ENV=production

CMD ["node", "server.js"]