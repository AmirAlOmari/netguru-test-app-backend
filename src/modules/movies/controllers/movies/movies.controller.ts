import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  NotFoundException,
  ParseIntPipe,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { DocumentType } from '@typegoose/typegoose';
import { ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { IsObjectIdPipe } from '../../../common/pipes/is-object-id/is-object-id.pipe';
import { DefaultValuePipe } from '../../../common/pipes/default-value/default-value.pipe';
import { ExtApiMovieNotFound } from '../../../ext-apis/errors/ext-api-movie-not-found/ext-api-movie-not-found.error';
import { CreateMovieDto } from '../../dtos/create-movie/create-movie.dto';
import { CommentMovieDto } from '../../dtos/comment-movie/comment-movie.dto';
import { Movies } from '../../models/movies/movies.model';
import { Ratings } from '../../models/ratings/ratings.model';
import { FindMovieByIdPipe } from '../../pipes/find-movie-by-id/find-movie-by-id.pipe';
import { MoviesService } from '../../services/movies/movies.service';

@Controller('movies')
@ApiExtraModels(Movies, Ratings)
@ApiTags('movies')
export class MoviesController {
  constructor(public readonly moviesService: MoviesService) {}

  @Post()
  async create(@Body() createMovieDto: CreateMovieDto) {
    try {
      const movie = await this.moviesService.createFromThirdParty(createMovieDto);

      return {
        data: movie,
      };
    } catch (error) {
      if (error instanceof ExtApiMovieNotFound) {
        throw new NotFoundException();
      }

      return JSON.stringify(error);
    }
  }

  @Get()
  async getAll(
    @Query('sortBy') sortBy = '_id',
    @Query('sortDir') sortDir = 'DESC',
    @Query('skip', DefaultValuePipe.create(0), ParseIntPipe) skip,
    @Query('limit', DefaultValuePipe.create(50), ParseIntPipe) limit,
    @Query('search') search = '',
  ) {
    const requestQuery = { sortBy, sortDir, skip, limit, search };

    const [allMovies, allCount] = await Promise.all([
      this.moviesService.getAll(requestQuery),
      this.moviesService.getAllCount(requestQuery),
    ]);

    const count = allMovies.length;

    return {
      data: allMovies,
      meta: {
        limit,
        skip,
        count,
        allCount,
      },
    };
  }

  @Get(':movieId')
  async getOne(
    @Param('movieId', IsObjectIdPipe) movieId: string,
    @Param('movieId', IsObjectIdPipe, FindMovieByIdPipe) movie: DocumentType<Movies>,
  ) {
    if (!movie) {
      throw new NotFoundException();
    }

    return {
      data: movie,
    };
  }

  @Patch(':movieId')
  async update(
    @Param('movieId', IsObjectIdPipe) movieId: string,
    @Param('movieId', IsObjectIdPipe, FindMovieByIdPipe) movie: DocumentType<Movies>,
    @Body() updateMovieDto, // TODO: provide validation dto
  ) {
    if (!movie) {
      throw new NotFoundException();
    }

    const updatedMovie = await this.moviesService.update(movie, updateMovieDto);

    return {
      data: updatedMovie,
    };
  }

  @Delete(':movieId')
  async remove(
    @Param('movieId', IsObjectIdPipe) movieId: string,
    @Param('movieId', IsObjectIdPipe, FindMovieByIdPipe) movie: DocumentType<Movies>,
  ) {
    if (!movie) {
      throw new NotFoundException();
    }

    const removedMovie = await this.moviesService.remove(movie);

    return {
      data: removedMovie,
    };
  }

  @Post(':movieId/comment')
  async comment(
    @Param('movieId', IsObjectIdPipe) movieId: string,
    @Param('movieId', IsObjectIdPipe, FindMovieByIdPipe) movie: DocumentType<Movies>,
    @Body() commentMovieDto: CommentMovieDto,
  ) {
    if (!movie) {
      throw new NotFoundException();
    }

    const comment = await this.moviesService.comment(movie, commentMovieDto);

    return {
      data: comment,
    };
  }
}
