import { Movies } from '../../../movies/models/movies/movies.model';
import { ExtApiNames } from '../../enums/ext-api-names/ext-api-names.enum';

export abstract class AbstractExtApiAdapter<OriginalMovieType = any> {
  abstract readonly name: ExtApiNames;

  abstract readonly host: string;

  abstract normalizeTitle(title: string): string;

  abstract async convert(originalMovie: OriginalMovieType): Promise<Movies>;

  abstract async getMovieByTitle(title: string): Promise<Movies>;
}
