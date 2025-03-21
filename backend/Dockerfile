ARG VERSION=18-alpine

FROM node:${VERSION}

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 5002

CMD [ "node","server.js" ]