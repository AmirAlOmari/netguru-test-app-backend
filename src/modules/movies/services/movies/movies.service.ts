import { Injectable, Type } from '@nestjs/common';
import { ReturnModelType, DocumentType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Types } from 'mongoose';
import { ExtApiNames } from '../../../ext-apis/enums/ext-api-names/ext-api-names.enum';
import { ExtApiAdapterFactory } from '../../../ext-apis/factories/ext-api-adapter/ext-api-adapter.factory';
import { CreateMovieDto } from '../../dtos/create-movie/create-movie.dto';
import { FindParams } from '../../interfaces/find-params/find-params.interface';
import { findParamsDefault } from '../../constants/find-params/find-params.default.constant';
import { Movies } from '../../models/movies/movies.model';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movies) private readonly moviesModel: ReturnModelType<typeof Movies>,
    private readonly extApiAdapterFactory: ExtApiAdapterFactory,
  ) {}

  appendSearchQuery(search, moviesQuery) {
    const searchRegex = new RegExp(`${search}`, 'gi');

    moviesQuery.where('title', searchRegex);
  }

  async getAll({
    sortBy = findParamsDefault.sortBy,
    sortDir = findParamsDefault.sortDir,
    skip = findParamsDefault.skip,
    limit = findParamsDefault.limit,
    search = findParamsDefault.search,
  }: FindParams = findParamsDefault) {
    const moviesQuery = this.moviesModel.find({});

    if (search) {
      this.appendSearchQuery(search, moviesQuery);
    }

    if (sortBy && sortDir) {
      moviesQuery.sort({ [sortBy]: sortDir.toUpperCase() === 'ASC' ? 1 : -1 });
    }

    if (skip) {
      moviesQuery.skip(parseInt(skip as any, 10));
    }

    if (limit) {
      moviesQuery.limit(parseInt(limit as any, 10));
    }

    const allMovies = await moviesQuery.exec();

    return allMovies;
  }

  async getAllCount({ search = findParamsDefault.search }: FindParams = findParamsDefault) {
    const moviesQuery = this.moviesModel.find({});

    if (search) {
      this.appendSearchQuery(search, moviesQuery);
    }

    const allCount = await moviesQuery.count().exec();

    return allCount;
  }

  async getById(movieId: string | Types.ObjectId) {
    const movie = await this.moviesModel.findById(movieId).exec();

    return movie;
  }

  async createFromThirdParty(createMovieDto: CreateMovieDto) {
    const adapter = this.extApiAdapterFactory.chooseAdapter(createMovieDto.__extApi);

    const movieDto = await adapter.getMovieByTitle(createMovieDto.title);

    const movie = await this.moviesModel.create(movieDto);

    return movie;
  }

  async update(movie: DocumentType<Movies>, updateMovieDto) {
    const proms = [this.updateById(movie._id, updateMovieDto)];

    return await Promise.all(proms);
  }

  async updateById(movieId: string | Types.ObjectId, updateMovieDto) {
    const updatedMovie = await this.moviesModel.findByIdAndUpdate(movieId, updateMovieDto, { new: true }).exec();

    return updatedMovie;
  }

  async updateByIdWithQuery(movieId: string | Types.ObjectId, updateMovieDoc: any) {
    const updatedMovie = await this.moviesModel.findByIdAndUpdate(movieId, updateMovieDoc, { new: true }).exec();

    return updatedMovie;
  }

  async remove(movie: DocumentType<Movies>) {
    const proms = [this.removeById(movie._id)];

    return await Promise.all(proms);
  }

  async removeById(movieId: string | Types.ObjectId) {
    return await this.moviesModel.findByIdAndDelete(movieId).exec();
  }
}
