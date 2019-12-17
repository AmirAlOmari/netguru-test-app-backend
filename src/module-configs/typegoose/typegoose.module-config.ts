import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from '../../modules/config/config.module';
import { ConfigService } from '../../modules/config/services/config/config.service';

export const TypegooseConfiguredModule = TypegooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get('DATABASE_URL'),
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }),
  inject: [ConfigService],
});
