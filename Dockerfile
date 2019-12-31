FROM node:dubnium-jessie

WORKDIR /usr/src/app

EXPOSE 4000

EXPOSE 4004 

RUN apt-get update \
  && apt-get upgrade -y \
  && apt-get install -y \
  build-essential \
  ca-certificates \
  gcc \
  git \
  libpq-dev \
  make \
  python-pip \
  python2.7 \
  && apt-get autoremove \
  && apt-get clean

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY . .

CMD ["npm", "run", "debug"]