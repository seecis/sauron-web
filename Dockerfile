FROM node

WORKDIR /sauron-web
COPY . .
RUN yarn install
RUN yarn run webpack-cli --config webpack.config.prod.js
WORKDIR /sauron-web/dist
ENTRYPOINT yarn run serve
EXPOSE 5000

