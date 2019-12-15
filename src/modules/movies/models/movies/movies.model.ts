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
import { Ratings } from '../ratings/ratings.model';

export class Movies {
  @IsString()
  @prop()
  title: string;

  @IsNumber()
  @prop()
  year: number;

  @IsString()
  @prop()
  rated: string; // could be enum

  @IsDate()
  @prop()
  released: Date;

  @ApiProperty({ description: 'Time in minutes' })
  @IsNumber()
  @prop()
  runtime: number;

  @IsArray()
  @arrayProp({ items: String })
  genres: string[];

  @IsArray()
  @arrayProp({ items: String })
  directors: string[];

  @IsArray()
  @arrayProp({ items: String })
  writers: string[];

  @IsArray()
  @arrayProp({ items: String })
  actors: string[];

  @IsString()
  @prop()
  plot: string;

  @IsArray()
  @arrayProp({ items: String })
  languages: string[];

  @IsArray()
  @arrayProp({ items: String })
  countries: string[];

  @IsArray()
  @arrayProp({ items: String })
  awards: string[];

  @IsArray()
  @arrayProp({ items: String })
  posters: string[];

  @IsArray()
  @ValidateNested()
  @arrayProp({ items: Ratings })
  ratings: Ratings[];

  @IsNumber()
  @prop()
  metascore: number;

  @IsNumber()
  @prop()
  imdbRating: number;

  @IsNumber()
  @prop()
  imdbVotes: number;

  @IsString()
  @prop()
  imdbID: string;

  @IsString()
  @prop()
  type: string;

  @IsDate()
  @prop()
  dvd: Date;

  @IsString()
  @prop()
  boxOffice: string;

  @IsString()
  @prop()
  production: string;

  @IsString()
  @prop({ required: false })
  website?: string;
}
