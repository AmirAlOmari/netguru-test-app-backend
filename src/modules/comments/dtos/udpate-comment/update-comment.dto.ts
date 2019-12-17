import { IsString, IsOptional, IsMongoId, MinLength } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  comment: string;
}
