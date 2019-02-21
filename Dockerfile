FROM node:alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json .
RUN npm i
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]
