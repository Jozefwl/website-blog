FROM node:24.14.0-trixie-slim

WORKDIR /app

COPY package.json ./
RUN npm install --production --ignore-scripts

COPY server.js ./

EXPOSE 5000

CMD ["node", "server.js"]