import { IsString, IsNumber, IsDate } from 'class-validator';
import { Transform, Expose, Type } from 'class-transformer';
import { Rename, Default } from '../__utils__';

export class OriginalMovieRatingDto {
  @Rename('Source')
  @IsString()
  source: string;

  @Rename('Value')
  @IsString()
  value: string;
}
