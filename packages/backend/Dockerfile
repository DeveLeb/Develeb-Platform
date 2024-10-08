# Stage 1: Build the app
FROM node:current-alpine AS build

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY ./packages/backend/package.json ./
COPY package-lock.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Bundle app source
COPY ./packages/backend ./

# Build the TypeScript files
RUN npm run build

# Stage 2: Production image
FROM node:current-alpine

# Set environment to production
ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

# Copy only production dependencies
COPY ./packages/backend/package.json ./
COPY package-lock.json ./

# Install only production dependencies for backend
RUN npm ci --omit=dev

# Copy the built app from the build stage
COPY --from=build /usr/src/app/dist ./dist


# Expose port 8080
EXPOSE 8080

# Start the app with migration script (not best practice - migrations should be outside the dockerfile)
CMD ["sh", "-c", "npm run migrate:prod && npm start"]
