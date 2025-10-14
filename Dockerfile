FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
#Optional: disable source maps to shrink output

ENV NEXT_DISABLE_SOURCEMAPS=1
ENV NODE_ENV=production
RUN npm run build
#Runtime: tiny image; no node_modules copied directly

FROM gcr.io/distroless/nodejs24 AS runner
#For alpine alternative: use node:24-alpine and add a non-root user; distroless is smaller.

WORKDIR /app
#Copy the minimal standalone server and assets

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
#Distroless runs as nonroot by default; port exposure is metadata only

EXPOSE 3000
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
#Distroless requires absolute entrypoint; Next’s standalone server lives at server.js under the .next/standalone root

CMD ["/app/server.js"]