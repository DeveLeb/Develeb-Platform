# Stage 1: Build the app
FROM node:current-alpine AS build

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Bundle app source
COPY . .

# Build the TypeScript files
RUN npm run build

# Stage 2: Production image
FROM node:current-alpine

# Set environment to production
ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

# Copy only production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy the built app from the build stage
COPY --from=build /usr/src/app/dist ./dist

RUN cat ./dist/db/migrate.js

# Expose port 8080
EXPOSE 8080

# Start the app with migration script (not best practice - migrations should be outside the dockerfile)
CMD ["sh", "-c", "ls -ls -laR ./dist && cat ./dist/db.migrate.js && npm run migrate:prod && npm start"]
