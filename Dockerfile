# Stage 1: Build
FROM node:22-alpine AS build

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine

RUN npm install -g pm2 serve

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY ecosystem.config.cjs .

EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.cjs"]
