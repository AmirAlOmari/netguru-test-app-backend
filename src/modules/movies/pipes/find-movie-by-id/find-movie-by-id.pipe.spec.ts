import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from '../../services/movies/movies.service';
import { FindMovieByIdPipe } from './find-movie-by-id.pipe';

const mockMoviesService = {};

describe('FindMovieByIdPipe', () => {
  let pipe: FindMovieByIdPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindMovieByIdPipe,
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    pipe = module.get<FindMovieByIdPipe>(FindMovieByIdPipe);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });
});
