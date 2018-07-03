FROM node:slim

RUN yarn global add serve
RUN yarn global add webpack-cli
WORKDIR /sauron-web
COPY . .
RUN yarn install --frozen-lockfile --production
RUN webpack-cli --config webpack.config.prod.js
RUN rm node_modules -rf
WORKDIR /sauron-web/dist
ENTRYPOINT serve
EXPOSE 5000

