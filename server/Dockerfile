FROM --platform=linux/amd64 node:current-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --production --ignore-scripts

COPY server.js ./

EXPOSE 5000

CMD ["node", "server.js"]