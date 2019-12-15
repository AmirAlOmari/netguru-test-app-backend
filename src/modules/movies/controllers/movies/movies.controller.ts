import { Controller, Get, Post, Body, NotFoundException } from '@nestjs/common';
import { ExtApiMovieNotFound } from '../../../ext-apis/errors/ext-api-movie-not-found/ext-api-movie-not-found.error';
import { CreateMovieDto } from '../../dtos/create-movie/create-movie.dto';
import { MoviesService } from '../../services/movies/movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post('/')
  async create(@Body() createMovieDto: CreateMovieDto) {
    const originalMovie = {
      Title: 'The Wolf of Wall Street',
      Year: '2013',
      Rated: 'R',
      Released: '25 Dec 2013',
      Runtime: '180 min',
      Genre: 'Biography, Crime, Drama',
      Director: 'Martin Scorsese',
      Writer: 'Terence Winter (screenplay), Jordan Belfort (book)',
      Actors: 'Leonardo DiCaprio, Jonah Hill, Margot Robbie, Matthew McConaughey',
      Plot:
        'Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government.',
      Language: 'English, French',
      Country: 'USA',
      Awards: 'Nominated for 5 Oscars. Another 38 wins & 165 nominations.',
      Poster: 'https://m.media-amazon.com/images/M/MV5BMjIxMjgxNTk0MF5BMl5BanBnXkFtZTgwNjIyOTg2MDE@._V1_SX300.jpg',
      Ratings: [
        { Source: 'Internet Movie Database', Value: '8.2/10' },
        { Source: 'Rotten Tomatoes', Value: '79%' },
        { Source: 'Metacritic', Value: '75/100' },
      ],
      Metascore: '75',
      imdbRating: '8.2',
      imdbVotes: '1,069,666',
      imdbID: 'tt0993846',
      Type: 'movie',
      DVD: '25 Mar 2014',
      BoxOffice: '$91,330,760',
      Production: 'Paramount Studios',
      Website: 'N/A',
      Response: 'True',
    };

    try {
      const movie = await this.moviesService.createFromThirdParty(createMovieDto);

      return movie;
    } catch (error) {
      if (error instanceof ExtApiMovieNotFound) {
        throw new NotFoundException();
      }

      return JSON.stringify(error);
    }
  }
}
