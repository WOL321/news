FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy bot code
COPY . .

# Expose health check port
EXPOSE 8000

# Run as non-root user for security
RUN addgroup -g 1001 -S botgroup && \
    adduser -S botuser -u 1001 -G botgroup
USER botuser

# Start the bot
CMD ["node", "index.js"]
