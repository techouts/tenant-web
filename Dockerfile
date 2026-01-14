# Use Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the Next.js app
RUN npm run build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=9002

# Expose port
EXPOSE 9002

# Start Next.js
CMD ["npm", "start"]
