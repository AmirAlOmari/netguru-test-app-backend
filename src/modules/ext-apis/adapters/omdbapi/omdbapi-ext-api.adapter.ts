import { Injectable, HttpService } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ConfigService } from '../../../config/services/config/config.service';
import { Movies } from '../../../movies/models/movies/movies.model';
import { AbstractExtApiAdapter } from '../../adapters/abstract/abstract-ext-api.adapter';
import { ExtApiNames } from '../../enums/ext-api-names/ext-api-names.enum';
import { OriginalMovie } from './interfaces/original-movie/original-movie.interface';
import { OriginalMovieDto } from './dtos/original-movie/original-movie.dto';
import { ExtApiMovieNotFound } from '../../errors/ext-api-movie-not-found/ext-api-movie-not-found.error';

@Injectable()
export class OmdbapiExtApiAdapter extends AbstractExtApiAdapter<OriginalMovie> {
  constructor(public readonly httpService: HttpService, public readonly configService: ConfigService) {
    super();
  }

  readonly name = ExtApiNames.Omdbapi;

  readonly host = 'http://www.omdbapi.com';

  readonly apiKey = this.configService.get('OMDBAPI_KEY');

  normalizeTitle(title: string) {
    const normalizedTitle = title.trim().replace(' ', '+');

    return normalizedTitle;
  }

  async convert(originalMovie: OriginalMovie) {
    const convertedMovie = plainToClass(OriginalMovieDto, originalMovie, {
      excludeExtraneousValues: true,
      // enableImplicitConversion: true,
    });

    return convertedMovie as any;
  }

  async getMovieByTitle(title: string) {
    try {
      const normalizedTitle = this.normalizeTitle(title);

      const res = await this.httpService
        .get(this.host, { params: { t: normalizedTitle, apikey: this.apiKey } })
        .toPromise();

      if (res.data && res.data.Response === 'False' && res.data.Error === 'Movie not found!') {
        throw await ExtApiMovieNotFound.createError();
      }

      const originalMovie = res.data;

      const convertedMovie = await this.convert(originalMovie);

      return convertedMovie;
    } catch (error) {
      throw error;
    }
  }
}
