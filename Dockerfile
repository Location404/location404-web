FROM node:20-alpine as builder

WORKDIR /app

ARG VITE_AUTH_API
ARG VITE_GAME_API
ARG VITE_DATA_API
ARG VITE_GOOGLE_MAPS_API_KEY

ENV VITE_AUTH_API=$VITE_AUTH_API
ENV VITE_GAME_API=$VITE_GAME_API
ENV VITE_DATA_API=$VITE_DATA_API
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY

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
