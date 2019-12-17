import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from './modules/config/services/config/config.service';
import { SwaggerInitializer } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appPort = configService.get('PORT');

  app.useGlobalPipes(new ValidationPipe({ transform: true, forbidUnknownValues: true }));

  const swaggerInitializer = new SwaggerInitializer(app);
  swaggerInitializer.init();

  await app.listen(appPort);
}
bootstrap();
