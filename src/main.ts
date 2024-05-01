import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/env';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionFilter } from './common/exceptions/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, })
  );

  app.useGlobalFilters(new ExceptionFilter())

  await app.listen(envs.port);
}
bootstrap();
