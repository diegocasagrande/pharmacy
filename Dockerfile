FROM node:11.4.0-stretch

WORKDIR /usr/app

ENV NODE_ENV=production

COPY package.json /usr/app/

RUN npm install

ADD /src/ /usr/app/

EXPOSE 3013

CMD ["npm", "start"]