import { IAppConfig } from '../../interfaces/app-config/app-config.interface';

export const appConfigDefault: IAppConfig = {
  PORT: 3000,
  ACCESS_KEY: 'not-so-secret',
  MULTER_PATH: './data/upload',
};
