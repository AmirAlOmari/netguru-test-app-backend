import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  NotFoundException,
  ParseIntPipe,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { DocumentType } from '@typegoose/typegoose';
import { ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { IsObjectIdPipe } from '../../../common/pipes/is-object-id/is-object-id.pipe';
import { DefaultValuePipe } from '../../../common/pipes/default-value/default-value.pipe';
import { Movies } from '../../../movies/models/movies/movies.model';
import { FindMovieByIdPipe } from '../../../movies/pipes/find-movie-by-id/find-movie-by-id.pipe';
import { CreateCommentDto } from '../../dtos/create-comment/create-comment.dto';
import { UpdateCommentDto } from '../../dtos/udpate-comment/update-comment.dto';
import { ReplyCommentDto } from '../../dtos/reply-comment/reply-comment.dto';
import { Comments } from '../../models/comments/comments.model';
import { FindCommentByIdPipe } from '../../pipes/find-comment-by-id/find-comment-by-id.pipe';
import { CommentsService } from '../../services/comments/comments.service';

@Controller('comments')
@ApiExtraModels(Comments)
@ApiTags('comments')
export class CommentsController {
  constructor(public readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Body('movieId', FindMovieByIdPipe) movie?: DocumentType<Movies>,
  ) {
    if (!movie) {
      throw new NotFoundException();
    }

    const comment = await this.commentsService.create(createCommentDto, movie);

    return {
      data: comment,
    };
  }

  @Get()
  async getAll(
    @Query('sortBy') sortBy = '_id',
    @Query('sortDir') sortDir = 'DESC',
    @Query('skip', DefaultValuePipe.create(0), ParseIntPipe) skip,
    @Query('limit', DefaultValuePipe.create(50), ParseIntPipe) limit,
  ) {
    const requestQuery = { sortBy, sortDir, skip, limit };

    const [allComments, allCount] = await Promise.all([
      this.commentsService.getAll(requestQuery),
      this.commentsService.getAllCount(),
    ]);

    const count = allComments.length;

    return {
      data: allComments,
      meta: {
        limit,
        skip,
        count,
        allCount,
      },
    };
  }

  @Get(':commentId')
  async getOne(
    @Param('commentId', IsObjectIdPipe) commentId: string,
    @Param('commentId', IsObjectIdPipe, FindCommentByIdPipe) comment: DocumentType<Comments>,
  ) {
    if (!comment) {
      throw new NotFoundException();
    }

    return {
      data: comment,
    };
  }

  @Patch(':commentId')
  async update(
    @Param('commentId', IsObjectIdPipe) commentId: string,
    @Param('commentId', IsObjectIdPipe, FindCommentByIdPipe) comment: DocumentType<Comments>,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    if (!comment) {
      throw new NotFoundException();
    }

    const updatedComment = await this.commentsService.update(comment, updateCommentDto);

    return {
      data: updatedComment,
    };
  }

  @Delete(':commentId')
  async remove(
    @Param('commentId', IsObjectIdPipe) commentId: string,
    @Param('commentId', IsObjectIdPipe, FindCommentByIdPipe) comment: DocumentType<Comments>,
  ) {
    if (!comment) {
      throw new NotFoundException();
    }

    const removedComment = await this.commentsService.remove(comment);

    return {
      data: removedComment,
    };
  }

  @Post(':commentId/reply')
  async reply(
    @Param('commentId', IsObjectIdPipe) commentId: string,
    @Param('commentId', IsObjectIdPipe, FindCommentByIdPipe) comment: DocumentType<Comments>,
    @Body() replyCommentDto: ReplyCommentDto,
  ) {
    if (!comment) {
      throw new NotFoundException();
    }

    const replyComment = await this.commentsService.reply(comment, replyCommentDto);

    return {
      data: replyComment,
    };
  }
}
