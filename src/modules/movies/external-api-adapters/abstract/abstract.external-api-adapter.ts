export abstract class ExternalApiAdapter {
  abstract async getMovieByName(name: string): Promise<any>; // TODO: type
}
