# Use official Node.js image as a base
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies separately
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 3000 (default port for Next.js)
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "start"]