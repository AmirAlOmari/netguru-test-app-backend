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
import { Comments } from '../../../comments/models/comments/comments.model';
import { Ratings } from '../ratings/ratings.model';

@modelOptions({ schemaOptions: { timestamps: true } })
export class Movies {
  @ApiProperty()
  @IsString()
  @prop()
  title: string;

  @ApiProperty()
  @IsNumber()
  @prop()
  year: number;

  @ApiProperty()
  @IsString()
  @prop()
  rated: string; // could be enum

  @ApiProperty()
  @IsDate()
  @prop()
  released: Date;

  @ApiProperty({ description: 'Time in minutes' })
  @IsNumber()
  @prop()
  runtime: number;

  @ApiProperty()
  @IsArray()
  @arrayProp({ items: String })
  genres: string[];

  @ApiProperty()
  @IsArray()
  @arrayProp({ items: String })
  directors: string[];

  @ApiProperty()
  @IsArray()
  @arrayProp({ items: String })
  writers: string[];

  @ApiProperty()
  @IsArray()
  @arrayProp({ items: String })
  actors: string[];

  @ApiProperty()
  @IsString()
  @prop()
  plot: string;

  @ApiProperty()
  @IsArray()
  @arrayProp({ items: String })
  languages: string[];

  @ApiProperty()
  @IsArray()
  @arrayProp({ items: String })
  countries: string[];

  @ApiProperty()
  @IsArray()
  @arrayProp({ items: String })
  awards: string[];

  @ApiProperty()
  @IsArray()
  @arrayProp({ items: String })
  posters: string[];

  @ApiProperty({ type: [Ratings] })
  @IsArray()
  @ValidateNested()
  @arrayProp({ items: Ratings })
  ratings: Ratings[];

  @ApiProperty()
  @IsNumber()
  @prop()
  metascore: number;

  @ApiProperty()
  @IsNumber()
  @prop()
  imdbRating: number;

  @ApiProperty()
  @IsNumber()
  @prop()
  imdbVotes: number;

  @ApiProperty()
  @IsString()
  @prop()
  imdbID: string;

  @ApiProperty()
  @IsString()
  @prop()
  type: string;

  @ApiProperty()
  @IsDate()
  @prop()
  dvd: Date;

  @ApiProperty()
  @IsString()
  @prop()
  boxOffice: string;

  @ApiProperty()
  @IsString()
  @prop()
  production: string;

  @ApiProperty()
  @IsString()
  @prop({ required: false })
  website?: string;

  @ApiProperty({ description: 'Ref to comment' })
  @arrayProp({ itemsRef: 'Comments' })
  comments: Array<Ref<Comments>>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
