import { NestApplication } from '@nestjs/core';
import { SwaggerModule, SwaggerDocument, SwaggerBaseConfig, DocumentBuilder } from '@nestjs/swagger';
import { ConfigModule } from '../modules/config/config.module';
import { ConfigService } from '../modules/config/services/config/config.service';

export interface TSwaggerDocumentInitConfigCreateOptionsFnArg {
  app: NestApplication;
  configService: ConfigService;
}

export type TSwaggerDocumentInitConfigCreateOptionsFn = (
  args: TSwaggerDocumentInitConfigCreateOptionsFnArg,
) => DocumentBuilder;

export interface ISwaggerDocumentInitConfig {
  name: string;
  createDocumentOptionsBuilder: TSwaggerDocumentInitConfigCreateOptionsFn;
}

export type TSwaggerDocumentInitConfigs = ISwaggerDocumentInitConfig[];

export class SwaggerInitializer {
  constructor(private readonly app: NestApplication) {
    this.injectOtherDependencies();
  }

  private injectOtherDependencies() {
    this.configService = this.app.select(ConfigModule).get(ConfigService);
  }

  private configService: ConfigService;

  private readonly swaggerDocumentInitConfigs: TSwaggerDocumentInitConfigs = [
    {
      name: 'Main',
      createDocumentOptionsBuilder: ({ configService }) => {
        const documentOptionsBuilder = new DocumentBuilder()
          .setTitle('Joker Taxi Backend API')
          .setDescription(
            `
            Admin Auth:
              - Local:
                Authorization: Bearer not-so-secret

              - Production:
                Authorization: Basic dGVzdDp0ZXN0
                X-Authorization: Bearer not-so-secret
          `,
          )
          .setVersion('0.0.1')
          .addTag('files')
          .addTag('toys');

        return documentOptionsBuilder;
      },
    },
  ];

  createDocumentFromConfig(
    swaggerDocumentInitConfig: ISwaggerDocumentInitConfig,
    { basePath = '', schemes = ['http'] },
  ) {
    const documentOptionsBuilder = swaggerDocumentInitConfig.createDocumentOptionsBuilder({
      app: this.app,
      configService: this.configService,
    });

    documentOptionsBuilder.setSchemes(...(schemes as any)).setBasePath(basePath);

    const documentOptions = documentOptionsBuilder.build();

    const document = SwaggerModule.createDocument(this.app, documentOptions);

    return document;
  }

  createAndSetupDocuments(swaggerDocumentInitConfigs: TSwaggerDocumentInitConfigs) {
    const configNodeEnv = this.configService.get('NODE_ENV');

    const basePath = configNodeEnv === 'production' ? '/api' : '/';
    const schemes = configNodeEnv === 'production' ? ['https'] : ['http', 'https'];

    this.swaggerDocumentInitConfigs.forEach(swaggerDocumentInitConfig => {
      const document = this.createDocumentFromConfig(swaggerDocumentInitConfig, { basePath, schemes });
      const docuemntEndPoint = swaggerDocumentInitConfig.name === 'Main' ? '' : `/${swaggerDocumentInitConfig.name}`;

      SwaggerModule.setup(`/swagger${docuemntEndPoint}`, this.app, document);
    });
  }

  init() {
    this.createAndSetupDocuments(this.swaggerDocumentInitConfigs);
  }
}
