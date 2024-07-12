import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('TODO API')
    .setDescription('The Raffle Master API description')
    .setVersion('0.0.1-SNAPSHOT')
    .setLicense('GNU', 'https://choosealicense.com/licenses/lgpl-3.0/')
    .setContact('Erick Macedo', null, 'macedo.eriick@gmail.com')
    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     scheme: 'bearer',
    //     bearerFormat: 'JWT',
    //     name: 'Authorization',
    //     in: 'header',
    //   },
    //   'APIKey',
    // )
    // .addSecurityRequirements('APIKey')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const paths = Object.keys(document.paths).sort();

  document.paths = paths.reduce((acc, path) => {
    acc[path] = document.paths[path];
    return acc;
  }, {});

  SwaggerModule.setup(`/swagger`, app, document);

  app.enableCors({
    origin: configService.get('CORS_ORIGINS').split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(3000);
}

bootstrap();
