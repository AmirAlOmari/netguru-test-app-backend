import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ReturnModelType, getModelForClass } from '@typegoose/typegoose';
import { getModelToken, TypegooseModule } from 'nestjs-typegoose';
import { Types } from 'mongoose';
import { createDbTestModule, mongod } from '../../../db-test/db-test.module';
import { ExtApisModule } from '../../../ext-apis/ext-apis.module';
import { ExtApiNames } from '../../../ext-apis/enums/ext-api-names/ext-api-names.enum';
import { CommentsModule } from '../../../comments/comments.module';
import { MoviesService } from './movies.service';
import { Movies } from '../../models/movies/movies.model';
import { CreateMovieDto } from '../../dtos/create-movie/create-movie.dto';

describe('MoviesService', () => {
  const dbTestModule = createDbTestModule();
  let service: MoviesService;

  const beforeEachFn = async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [dbTestModule, TypegooseModule.forFeature([Movies]), ExtApisModule, CommentsModule],
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  };

  beforeEach(beforeEachFn);

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll()', () => {
    beforeEach(beforeEachFn);

    it('should be defined', () => {
      expect(service.getAll).toBeDefined();
    });

    it('should return array', async () => {
      const result = await service.getAll();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getAllCount()', () => {
    beforeEach(beforeEachFn);

    it('should be defined', () => {
      expect(service.getAllCount).toBeDefined();
    });

    it('should return number', async () => {
      const result = await service.getAllCount();

      expect(typeof result).toBe('number');
    });
  });

  describe('getById()', () => {
    beforeEach(beforeEachFn);

    it('should be defined', () => {
      expect(service.getById).toBeDefined();
    });

    it('should call moviesModel.findById()', async () => {
      const fakeMovieId = new Types.ObjectId();

      const spy = jest.spyOn(service.moviesModel, 'findById');
      const result = await service.getById(fakeMovieId);

      expect(spy).toHaveBeenCalledWith(fakeMovieId);

      expect(result).toBeFalsy();
    });
  });

  describe('createFromThirdParty()', () => {
    beforeEach(beforeEachFn);

    it('should be defined', () => {
      expect(service.createFromThirdParty).toBeDefined();
    });

    it('should create movie from third party', async () => {
      const createMovieDto: CreateMovieDto = { title: "Ocean's eleven", __extApi: ExtApiNames.Omdbapi };
      const movie = await service.createFromThirdParty(createMovieDto);

      expect(movie).toBeTruthy();
    });
  });

  afterAll(async () => {
    await mongod.stop();
  });
});
