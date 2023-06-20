import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { NextFunction } from 'express';

import 'src/extensions/array-extension';

import { AppModule } from './app.module';
import { ValidationExceptionFactory } from './exceptions/validations.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: ValidationExceptionFactory,
    })
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use((_req: Request, _res: Response, _next: NextFunction, error: Error) => {
    Logger.error(error, error.stack, 'App');
  });

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Apollo')
    .setDescription('Swagger documentaion apollo')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, { swaggerOptions: { defaultModelsExpandDepth: -1 } });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
