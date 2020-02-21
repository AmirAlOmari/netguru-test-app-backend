import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { MoviesService } from '../../../movies/services/movies/movies.service';
import { CommentsService } from './comments.service';

const mockCommentsModel = {};
const mockMoviesService = {};

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getModelToken('Comments'),
          useValue: mockCommentsModel,
        },
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
