import { Injectable, Type, forwardRef, Inject } from '@nestjs/common';
import { ReturnModelType, DocumentType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentQuery, Types } from 'mongoose';
import { ExtApiNames } from '../../../ext-apis/enums/ext-api-names/ext-api-names.enum';
import { ExtApiAdapterFactory } from '../../../ext-apis/factories/ext-api-adapter/ext-api-adapter.factory';
import { Comments } from '../../../comments/models/comments/comments.model';
import { CommentsService } from '../../../comments/services/comments/comments.service';
import { CreateMovieDto } from '../../dtos/create-movie/create-movie.dto';
import { CommentMovieDto } from '../../dtos/comment-movie/comment-movie.dto';
import { FindParamPopulate } from '../../enums/find-all-param-populate/find-all-param-populate.enum';
import { FindParams } from '../../interfaces/find-all-params/find-all-params.interface';
import { findParamsDefault } from '../../constants/find-all-params/find-all-params.default.constant';
import { Movies } from '../../models/movies/movies.model';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movies) public readonly moviesModel: ReturnModelType<typeof Movies>,
    public readonly extApiAdapterFactory: ExtApiAdapterFactory,
    @Inject(forwardRef(() => CommentsService)) public readonly commentsService: CommentsService,
  ) {}

  appendSearchQuery(
    search: string = '',
    moviesQuery: DocumentQuery<Array<DocumentType<Movies>>, DocumentType<Movies>>,
  ) {
    const searchRegex = new RegExp(`${search}`, 'gi'); // TODO: improve regexp

    // moviesQuery.equals({ title: searchRegex });

    moviesQuery.where('title', searchRegex);
  }

  async getAll({
    populate = findParamsDefault.populate,
    sortBy = findParamsDefault.sortBy,
    sortDir = findParamsDefault.sortDir,
    skip = findParamsDefault.skip,
    limit = findParamsDefault.limit,
    search = findParamsDefault.search,
  }: FindParams = findParamsDefault) {
    const moviesQuery = this.moviesModel.find();

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

    await Promise.all(
      allMovies.map(async movie => {
        if (populate.includes(FindParamPopulate.Comments)) {
          movie.comments = await Promise.all(
            movie.comments.map(async commentId =>
              this.commentsService.getById(commentId as Types.ObjectId, { recursive: true }),
            ),
          );
        }
      }),
    );

    return allMovies;
  }

  async getAllCount({ search = findParamsDefault.search }: FindParams = findParamsDefault) {
    const moviesQuery = this.moviesModel.find({});

    if (search) {
      this.appendSearchQuery(search, moviesQuery);
    }

    const allCount = await moviesQuery.countDocuments().exec();

    return allCount;
  }

  async getById(movieId: string | Types.ObjectId) {
    const movie = await this.moviesModel.findById(movieId).exec();

    if (movie) {
      movie.comments = await Promise.all(
        movie.comments.map(async commentId =>
          this.commentsService.getById(commentId as Types.ObjectId, { recursive: true }),
        ),
      );
    }

    return movie;
  }

  async addCommentToMovie(comment: DocumentType<Comments>, movie: DocumentType<Movies>) {
    const updatedMovie = await this.moviesModel.findByIdAndUpdate(
      movie._id,
      { $push: { comments: comment._id } },
      { new: true },
    );

    return updatedMovie;
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
    const updatedMovie = await this.moviesModel
      .findByIdAndUpdate(movieId, { $set: { ...updateMovieDto, updatedAt: new Date() } }, { new: true })
      .exec();

    return updatedMovie;
  }

  async updateByIdWithDoc(movieId: string | Types.ObjectId, updateMovieDoc: any) {
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

  async comment(movie: DocumentType<Movies>, commentMovieDto: CommentMovieDto) {
    const comment = await this.commentsService.create({ ...commentMovieDto, movieId: movie._id }, movie);

    return comment;
  }
}
