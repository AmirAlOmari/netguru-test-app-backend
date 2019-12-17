import { IsString, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { OriginalMovieRatingDto } from '../original-movie-rating/original-movie-rating.dto';
import { OriginalMovie } from '../../interfaces/original-movie/original-movie.interface';
import { Rename, Default, Split, ParseInt, ParseFloat, ToDate } from '../__utils__';

export class OriginalMovieDto {
  @Rename<OriginalMovie>('Title')
  @Default('')
  @IsString()
  title: string;

  @Rename<OriginalMovie>('Year')
  @Default(0)
  @ParseFloat()
  @IsNumber()
  year: number;

  @Rename<OriginalMovie>('Rated')
  @Default('')
  @IsString()
  rated: string; // could be enum

  @Rename<OriginalMovie>('Released')
  @ToDate()
  released: Date;

  @Rename<OriginalMovie>('Runtime')
  @Default(0)
  @ParseFloat()
  @IsNumber()
  runtime: number;

  @Rename<OriginalMovie>('Genre')
  @Default('')
  @Split()
  genres: string[];

  @Rename<OriginalMovie>('Director')
  @Default('')
  @Split()
  directors: string[];

  @Rename<OriginalMovie>('Writer')
  @Default('')
  @Split()
  writers: string[];

  @Rename<OriginalMovie>('Actors')
  @Default('')
  @Split()
  actors: string[];

  @Rename<OriginalMovie>('Plot')
  @Default('')
  plot: string;

  @Rename<OriginalMovie>('Language')
  @Default('')
  @Split()
  languages: string[];

  @Rename<OriginalMovie>('Country')
  @Default('')
  @Split()
  countries: string[];

  @Rename<OriginalMovie>('Awards')
  @Default('')
  @Type(() => String)
  @Split()
  awards: string[];

  @Rename<OriginalMovie>('Poster')
  @Default('')
  @Type(() => String)
  @Split()
  posters: string[];

  @Rename<OriginalMovie>('Ratings')
  @Default([])
  @Type(() => OriginalMovieRatingDto)
  ratings: OriginalMovieRatingDto[];

  @Rename<OriginalMovie>('Metascore')
  @Default(0)
  @ParseFloat()
  @IsNumber()
  metascore: number;

  @Rename<OriginalMovie>('imdbRating')
  @Default(0)
  @ParseFloat()
  @IsNumber()
  imdbRating: number;

  @Rename<OriginalMovie>('imdbVotes')
  @Default(0)
  @ParseFloat()
  @IsNumber()
  imdbVotes: number;

  @Rename<OriginalMovie>('imdbID')
  @Default(0)
  @IsNumber()
  imdbID: string;

  @Rename<OriginalMovie>('Type')
  @Default('')
  @IsString()
  type: string;

  @Rename<OriginalMovie>('DVD')
  @Default(new Date(0))
  @ToDate()
  dvd: Date;

  @Rename<OriginalMovie>('BoxOffice')
  @Default('')
  @IsString()
  boxOffice: string;

  @Rename<OriginalMovie>('Production')
  @Default('')
  @IsString()
  production: string;

  @Rename<OriginalMovie>('Website')
  @Default('')
  @IsString()
  website: string;
}
