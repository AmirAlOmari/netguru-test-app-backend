import { Typegoose, Ref, modelOptions, arrayProp, prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  MinLength,
  IsOptional,
  IsInt,
  IsNumber,
  Matches,
  ValidateNested,
  IsDate,
} from 'class-validator';

export class Ratings {
  @ApiProperty()
  @IsString()
  @prop()
  source: string;

  @ApiProperty()
  @IsString()
  @prop()
  value: string;
}
