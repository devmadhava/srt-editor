# # Stage 1: build & test
# FROM node:20-alpine AS build

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .
# RUN npm run build
# RUN npm run test # run backend tests

# # Stage 2: production
# FROM node:20-alpine AS prod
# WORKDIR /app
# COPY --from=build /app .

# ENV NODE_ENV=production
# EXPOSE 3333
# CMD ["node", "build/server.js"]




# # ---------- Base Stage ----------
# FROM node:22.16.0-alpine3.22 AS base
# WORKDIR /app

# # ---------- Dependencies Stage (all deps) ----------
# FROM base AS deps
# ADD package.json package-lock.json ./
# RUN npm ci

# # ---------- Production Dependencies Stage ----------
# FROM base AS production-deps
# ADD package.json package-lock.json ./
# RUN npm ci --omit=dev

# # ---------- Build & Test Stage ----------
# FROM base AS build
# WORKDIR /app

# # Copy dependencies from deps stage
# COPY --from=deps /app/node_modules ./node_modules

# # Copy all source files
# ADD . .

# # Build the Adonis app (transpile to /build)
# RUN node ace build

# # Run Adonis tests (requires @japa/runner or similar configured)
# RUN node ace test

# # ---------- Production Stage ----------
# FROM base AS prod
# WORKDIR /app
# ENV NODE_ENV=production

# # Copy production dependencies
# COPY --from=production-deps /app/node_modules ./node_modules

# # Copy compiled build output
# COPY --from=build /app/build ./build

# # Expose Adonis port (default: 3333)
# EXPOSE 3333

# # Start Adonis app
# CMD ["node", "build/server.js"]



# ---------- Stage 1: Build & Test ----------
FROM node:22.16.0-alpine3.22 AS build

WORKDIR /app

# Copy dependency files first for better caching
COPY package.json package-lock.json ./

# Install all dependencies (including dev) for build & test
RUN npm ci

# Copy app source
COPY . .

# Build Adonis app
RUN node ace build

# Run Adonis tests
RUN node ace test

# ---------- Stage 2: Production ----------
FROM node:22.16.0-alpine3.22 AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy compiled app from build stage
COPY --from=build /app/build ./build

# Copy any other runtime files needed (like package.json, .env.example if required)
# COPY --from=build /app/ace.js ./ace.js
COPY --from=build /app/start ./start
COPY --from=build /app/adonisrc.ts ./adonisrc.ts

# Expose Adonis default port
EXPOSE 3333

# Start the app
CMD ["node", "build/bin/server.js"]
