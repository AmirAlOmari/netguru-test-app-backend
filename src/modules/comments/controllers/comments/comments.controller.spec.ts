import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from '../../../movies/services/movies/movies.service';
import { CommentsService } from '../../services/comments/comments.service';
import { CommentsController } from './comments.controller';

const mockMoviesService = {};
const mockCommentsService = {};

describe('Comments Controller', () => {
  let controller: CommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
