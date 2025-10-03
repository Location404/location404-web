FROM node:20-alpine as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve

COPY --from=builder /app/dist /app/dist
EXPOSE 3400

CMD ["serve", "-s", "dist", "-l", "3400"]
