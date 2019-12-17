import { Module, forwardRef } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/services/config/config.service';

export const mongod = new MongoMemoryServer();

export const createDbTestModule = (mongoOptions = {}) =>
  TypegooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      const [port, dbName] = await Promise.all([mongod.getPort(), mongod.getDbName()]);

      const typegooseConfig = {
        uri: `mongodb://127.0.0.1:${port}/${dbName}`,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ...mongoOptions,
      };

      return typegooseConfig;
    },
    inject: [ConfigService],
  });
