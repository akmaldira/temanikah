FROM node:18.16.0-alpine3.17 as development

WORKDIR /usr/src/app

COPY package*.json .

RUN yarn install

COPY . .

RUN yarn build

FROM node:18.16.0-alpine3.17 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json .

RUN yarn install --production

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/ormconfig.js /usr/src/app/.env ./

CMD ["yarn", "start"]