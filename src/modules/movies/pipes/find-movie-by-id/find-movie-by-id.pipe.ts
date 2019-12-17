import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { MoviesService } from '../../services/movies/movies.service';

@Injectable()
export class FindMovieByIdPipe implements PipeTransform {
  constructor(public readonly moviesService: MoviesService) {}

  async transform(movieId: string, metadata: ArgumentMetadata) {
    const movie = await this.moviesService.getById(movieId);

    return movie;
  }
}
