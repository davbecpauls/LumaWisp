# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --no-optional

# Copy the rest of the application code
COPY . .

# Build the application using the existing npm scripts
RUN npm run build:client
RUN npm run build:server

# Clean up to reduce image size
RUN npm prune --production && npm cache clean --force

# Expose the port the app runs on
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]