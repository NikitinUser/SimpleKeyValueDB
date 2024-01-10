FROM node:18.12-alpine as base

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8080
