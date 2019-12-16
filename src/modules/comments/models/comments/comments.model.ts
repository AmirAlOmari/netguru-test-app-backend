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
import { Movies } from '../../../movies/models/movies/movies.model';

@modelOptions({ schemaOptions: { timestamps: true } })
export class Comments {
  @prop({ ref: 'Movies' })
  movie: Ref<Movies>;

  @IsString()
  @prop()
  comment: string;

  @prop({ ref: 'Comments', required: false })
  parent?: Ref<Comments> | null;

  @arrayProp({ itemsRef: 'Comments' })
  children: Array<Ref<Comments>>;
}
