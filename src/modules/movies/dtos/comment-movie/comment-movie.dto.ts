import { IsString, MinLength } from 'class-validator';

export class CommentMovieDto {
  @IsString()
  @MinLength(1)
  comment: string;
}
