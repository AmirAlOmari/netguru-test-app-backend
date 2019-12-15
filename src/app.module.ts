import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { moduleConfigs } from './module-configs';
import { ConfigModule } from './modules/config/config.module';
import { CommonModule } from './modules/common/common.module';
import { MoviesModule } from './modules/movies/movies.module';

@Module({
  imports: [ConfigModule, ...moduleConfigs, CommonModule, MoviesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
