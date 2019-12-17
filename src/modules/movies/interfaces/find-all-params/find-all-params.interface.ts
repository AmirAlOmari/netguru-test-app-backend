import { FindParamPopulate } from '../../enums/find-all-param-populate/find-all-param-populate.enum';

export interface FindParams {
  populate?: FindParamPopulate[];
  sortBy?: string;
  sortDir?: string;
  skip?: number;
  limit?: number;
  search?: string;
}
