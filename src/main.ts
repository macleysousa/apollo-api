import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { NextFunction } from 'express';
import * as qs from 'qs';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from './app.module';
import { ValidationExceptionFactory } from './exceptions/validations.exception';

import 'system-x64';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);

  // Enable Express to parse queries with [] (e.g., ?ids[]=1&ids[]=2)
  const server = app.getHttpAdapter().getInstance();
  server.set('query parser', (str: string) => qs.parse(str));

  app.setGlobalPrefix('v1');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: ValidationExceptionFactory,
    }),
  );

  // Redirect '/' to '/docs'
  app.use((req: any, res: any, next: any) => {
    if (req.path === '/') {
      return res.redirect('/docs');
    }
    next();
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use((_req: Request, _res: Response, _next: NextFunction, error: Error) => {
    Logger.error(error, error.stack, 'App');
  });

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Apollo')
    .setDescription('Swagger documentation apollo')
    .setVersion('1.0')
    .setExternalDoc(undefined, '/docs/api-docs.json')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
    jsonDocumentUrl: '/docs/api-docs.json',
  });

  await app.listen(process.env.PORT || 5000).then(async () => {
    if (process.env.NODE_ENV == 'development') {
      Logger.warn(`Server started on http://localhost:${process.env.PORT || 5000}`, 'App');
      Logger.warn(`Swagger started on http://localhost:${process.env.PORT || 5000}/docs`, 'App');
    }
  });
}
bootstrap();
