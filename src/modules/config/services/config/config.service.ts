import { Injectable } from '@nestjs/common';
import { IConfig } from '../../interfaces/config/config.interface';
import { configDefault } from '../../constants/config/config.default.constant';

@Injectable()
export class ConfigService {
  private readonly configDefault: IConfig = configDefault;

  private readonly config: IConfig = this.configDefault;

  get<T = keyof IConfig>(key: T) {
    return this.config[key as any];
  }

  init() {
    this.initConfig();
  }

  initConfig() {
    const givenConfig = process.env;
    const configDefaultKeys = Object.keys(this.configDefault);

    configDefaultKeys.forEach(configDefaultKey => {
      if (configDefaultKey in givenConfig) {
        this.config[configDefaultKey] = givenConfig[configDefaultKey];
      }
    });
  }
}
