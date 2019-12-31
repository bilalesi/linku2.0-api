FROM node:dubnium-alpine

WORKDIR /usr/src/app

EXPOSE 4000

COPY ./package*.json .

COPY . .

RUN npm install

CMD ["npm", "start"]