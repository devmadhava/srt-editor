# Stage 1: Build + Test
FROM node:20-alpine AS build-and-test

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dev dependencies
RUN npm ci

# Copy all source files
COPY . .

# Pass API URL as build arg
ARG VITE_API_URL

# Bake this into image
ENV VITE_API_URL=${VITE_API_URL}

# Run tests
RUN npx jest    

# Build the app
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Copy only package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built output from build stage
COPY --from=build-and-test /app/build ./build

# Expose port 3000
EXPOSE 3000

# Set default command to start SSR server
CMD ["npm", "run", "start"]
