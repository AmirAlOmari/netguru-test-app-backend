export class ExtApiMovieNotFound extends Error {
  private constructor(message?: any) {
    super(message);
  }

  name = 'ExtApiMovieNotFound';

  public static async createError() {
    const error = new this();

    return error;
  }
}
