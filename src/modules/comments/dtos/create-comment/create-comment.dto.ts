import { IsString, IsMongoId, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsMongoId()
  movieId: string;

  @IsString()
  @MinLength(1)
  comment: string;
}
