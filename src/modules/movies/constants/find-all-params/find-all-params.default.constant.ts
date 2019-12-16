import { FindParamPopulate } from '../../enums/find-all-param-populate/find-all-param-populate.enum';
import { FindParams } from '../../interfaces/find-all-params/find-all-params.interface';

export const findParamsDefault: FindParams = {
  populate: [FindParamPopulate.Comments],
};
