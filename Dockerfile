FROM node:16-alpine

WORKDIR /app

EXPOSE 3000

COPY package.json /app/package.json
COPY .npmrc /app/.npmrc

ENV REACT_APP_API_URL="http://10.236.0.60:3435/cards/"


RUN npm install

COPY . /app


CMD ["npm", "start"]
