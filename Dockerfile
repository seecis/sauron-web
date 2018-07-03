FROM node:slim

WORKDIR /sauron-web
COPY . .
RUN yarn install --frozen-lockfile --production
RUN yarn global add serve
RUN yarn run webpack-cli --config webpack.config.prod.js
RUN rm node_modules -rf
WORKDIR /sauron-web/dist
ENTRYPOINT yarn run serve
EXPOSE 5000

