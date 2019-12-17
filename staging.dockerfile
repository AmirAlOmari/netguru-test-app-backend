# The instructions for the node-modules-builder stage
FROM node:12-alpine as node-modules-builder

# node-gyp deps
RUN apk --no-cache add python make g++

RUN npm install -g node-gyp

COPY package*.json ./

RUN npm install

# The instructions for builder stage
FROM node:12-alpine as builder

COPY . .

COPY --from=node-modules-builder node_modules ./node_modules

RUN npm i -g @nestjs/cli typescript

RUN npm run build

RUN npm prune --production

# The insuctions for the final stage
FROM node:12-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY --from=builder node_modules ./node_modules
COPY --from=builder dist ./dist

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
