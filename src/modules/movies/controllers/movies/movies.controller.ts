import { Controller, Get, Post, Body, Query, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { DefaultValuePipe } from '../../../common/pipes/default-value/default-value.pipe';
import { ExtApiMovieNotFound } from '../../../ext-apis/errors/ext-api-movie-not-found/ext-api-movie-not-found.error';
import { CreateMovieDto } from '../../dtos/create-movie/create-movie.dto';
import { MoviesService } from '../../services/movies/movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post('/')
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

  @Get('/')
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
}
