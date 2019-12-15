import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { extApiAdapters } from './adapters';
import { ExtApiAdapterFactory } from './factories/ext-api-adapter/ext-api-adapter.factory';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [...extApiAdapters, ExtApiAdapterFactory],
  exports: [...extApiAdapters, ExtApiAdapterFactory],
})
export class ExtApisModule {}
