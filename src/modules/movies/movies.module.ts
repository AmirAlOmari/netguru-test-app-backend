import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from '../config/config.module';
import { CommonModule } from '../common/common.module';
import { ExtApisModule } from '../ext-apis/ext-apis.module';
import { Movies } from './models/movies/movies.model';
import { MoviesService } from './services/movies/movies.service';
import { FindMovieByIdPipe } from './pipes/find-movie-by-id/find-movie-by-id.pipe';
import { MoviesController } from './controllers/movies/movies.controller';

@Module({
  imports: [TypegooseModule.forFeature([Movies]), ConfigModule, CommonModule, ExtApisModule],
  providers: [MoviesService, FindMovieByIdPipe],
  controllers: [MoviesController],
  exports: [TypegooseModule, MoviesService, FindMovieByIdPipe],
})
export class MoviesModule {}
