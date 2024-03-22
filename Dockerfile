# stage 1
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN yarn install

ADD *.sql /docker-entrypoint-initdb.d/

COPY . .

RUN yarn build

RUN apt-get update && \
    apt-get install -y postgresql-contrib








