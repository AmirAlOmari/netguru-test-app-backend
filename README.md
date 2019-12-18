# Netguru test backend app

### Run locally:

#### Requirements:

1. Node 12.x & npm match (^6.12)
2. MongoDB 4.2

#### Steps

1. Create folder and start mongo `$ mkdir ./data/db && mongod --dbpath="./data/db"`
2. Install dependencies `$ npm i`
3. Start `$ npx nest start`

### Run with docker

#### Requirements

1. docker & docker-compose

#### Steps

1. Create external volumes `$ docker volume create netguru-test-app_app-vol & docker volume create netguru-test-app_mongo-voll`
2. Build and start `$ docker-compose -f ./docker-compose.staging.yml up -d`

> Project also has live swagger docs. Feel free to open it on `localhost:3000/swagger/`

Project started with docker uses `*.env` files as config. If something is not specified in these files project uses default fallbacks from `src\modules\config\constants\config\config.default.constant.ts` file.
