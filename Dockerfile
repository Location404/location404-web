FROM node:20-alpine as builder

WORKDIR /app

# Build arguments for multiple API services
ARG VITE_USER_IDENTITY_API
ARG VITE_GAME_ENGINE_API

# Environment variables for build time
ENV VITE_USER_IDENTITY_API=$VITE_USER_IDENTITY_API
ENV VITE_GAME_ENGINE_API=$VITE_GAME_ENGINE_API

COPY package.json package-lock.json ./

RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist /app/dist

EXPOSE 3400
CMD ["serve", "-s", "dist", "-l", "3400"]
