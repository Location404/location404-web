FROM node:20-alpine as builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve

COPY --from=builder /app/dist /app/dist
COPY generate-config.sh /app/generate-config.sh

RUN chmod +x /app/generate-config.sh

EXPOSE 3400

CMD ["sh", "-c", "/app/generate-config.sh && serve -s dist -l 3400"]
