# 1. Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install && npm run build

# 2. Production stage
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app ./

# Expose Next.js default port
EXPOSE 3000

# Run app
CMD ["npm", "start"]