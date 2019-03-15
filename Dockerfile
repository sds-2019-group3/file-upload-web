FROM node:10.15.2-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --quiet

COPY . .

RUN PUBLIC_URL=/upload npm run build

FROM nginx:1.15.9-alpine

COPY --from=build /usr/src/app/build /usr/share/nginx/html
