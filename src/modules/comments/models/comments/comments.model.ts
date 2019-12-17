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
import { Movies } from '../../../movies/models/movies/movies.model';

@modelOptions({ schemaOptions: { timestamps: true } })
export class Comments {
  @ApiProperty({ description: 'Ref to movie' })
  @prop({ ref: 'Movies' })
  movie: Ref<Movies>;

  @ApiProperty()
  @IsString()
  @prop()
  comment: string;

  @ApiProperty({ description: 'Ref to parent comment ' })
  @prop({ ref: 'Comments', required: false })
  parent?: Ref<Comments> | null;

  @ApiProperty({ description: 'Ref to children comments' })
  @arrayProp({ itemsRef: 'Comments' })
  children: Array<Ref<Comments>>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
