FROM node:current-alpine as base

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Remove frontend package to reduce image size
RUN rm -rf packages/frontend

# Install app dependencies
RUN npm ci

# # Build the TypeScript files
# RUN npx lerna run build --scope=develeb-platform-api --verbose

RUN node ./node_modules/esbuild/install.js

# Expose port 5000
EXPOSE 5000

# Start the app
# CMD npx lerna run start --scope=develeb-platform-api --verbose
CMD npx lerna run dev --scope=develeb-platform-api --verbose
