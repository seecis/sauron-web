FROM node:slim

WORKDIR /sauron-web
COPY . .
RUN yarn install
RUN yarn add -g serve
RUN yarn run webpack-cli --config webpack.config.prod.js
RUN rm node_modules -rf
WORKDIR /sauron-web/dist
ENTRYPOINT yarn run serve
EXPOSE 5000

