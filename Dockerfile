FROM node:slim

RUN yarn global add serve
RUN yarn global add webpack-cli webpack
WORKDIR /sauron-web
COPY . .
RUN yarn install --frozen-lockfile --production=false
RUN webpack-cli --config webpack.config.js --mode production
ENTRYPOINT yarn serve
EXPOSE 5000

