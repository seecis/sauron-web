FROM node:slim

RUN yarn global add serve
RUN yarn global add webpack-cli webpack
WORKDIR /sauron-web
COPY . .
RUN yarn install --frozen-lockfile --production=false
ENTRYPOINT yarn server
EXPOSE 5000

