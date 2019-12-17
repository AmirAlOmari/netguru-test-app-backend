import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CommentsService } from '../../services/comments/comments.service';

@Injectable()
export class FindCommentByIdPipe implements PipeTransform {
  constructor(public readonly commentsService: CommentsService) {}

  async transform(commentId: string, metadata: ArgumentMetadata) {
    const comment = await this.commentsService.getById(commentId);

    return comment;
  }
}
