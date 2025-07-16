import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle('API').setDescription('API description').setVersion('1.0').build();
  const documentFactory = (): OpenAPIObject => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: process.env.FRONTEND_URL, // add your frontend URLs here
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'], // explicitly list headers your frontend sends
    credentials: false, // or true if you use cookies/auth tokens with credentials: 'include'
  });
  app.use(
    '/scalar',
    apiReference({
      spec: {
        content: documentFactory,
      },
    })
  );
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
