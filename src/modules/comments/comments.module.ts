import { Module, forwardRef } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from '../config/config.module';
import { CommonModule } from '../common/common.module';
import { MoviesModule } from '../movies/movies.module';
import { Comments } from './models/comments/comments.model';
import { CommentsService } from './services/comments/comments.service';
import { FindCommentByIdPipe } from './pipes/find-comment-by-id/find-comment-by-id.pipe';
import { CommentsController } from './controllers/comments/comments.controller';

@Module({
  imports: [TypegooseModule.forFeature([Comments]), ConfigModule, CommonModule, forwardRef(() => MoviesModule)],
  providers: [CommentsService, FindCommentByIdPipe],
  controllers: [CommentsController],
  exports: [TypegooseModule, CommentsService, FindCommentByIdPipe],
})
export class CommentsModule {}
