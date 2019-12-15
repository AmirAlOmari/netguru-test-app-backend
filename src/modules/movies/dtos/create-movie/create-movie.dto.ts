import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, MinLength, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ExtApiNames } from '../../../ext-apis/enums/ext-api-names/ext-api-names.enum';

export class CreateMovieDto {
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional({ required: false, enum: ExtApiNames, default: ExtApiNames.Omdbapi })
  @IsEnum(ExtApiNames)
  @IsOptional()
  __extApi?: ExtApiNames = ExtApiNames.Omdbapi;
}
