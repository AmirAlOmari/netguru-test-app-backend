import { Typegoose, Ref, modelOptions, arrayProp, prop } from '@typegoose/typegoose';
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
import { ApiProperty } from '@nestjs/swagger';

export class Ratings {
  @IsString()
  @prop()
  source: string;

  @IsString()
  @prop()
  value: string;
}
