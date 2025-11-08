FROM node:20-alpine as builder

WORKDIR /app

# Apenas Google Maps API Key (necessário para Street View)
ARG VITE_GOOGLE_MAPS_API_KEY
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY

# VITE_AUTH_API, VITE_GAME_API, VITE_DATA_API são opcionais
# Se não forem passados, o código usa paths relativos (/api, /gamehub)
# e o Traefik roteia para os serviços corretos

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
