import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { CommentsService } from '../../../comments/services/comments/comments.service';
import { ExtApiAdapterFactory } from '../../../ext-apis/factories/ext-api-adapter/ext-api-adapter.factory';
import { MoviesService } from '../../services/movies/movies.service';
import { MoviesController } from './movies.controller';

const mockMoviesModel = {};
const mockExtApiAdapterFactory = {};
const mockCommentsService = {};
const mockMoviesService = {};

describe('Movies Controller', () => {
  let controller: MoviesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: getModelToken('Movies'),
          useValue: mockMoviesModel,
        },
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
        {
          provide: ExtApiAdapterFactory,
          useValue: mockExtApiAdapterFactory,
        },
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
