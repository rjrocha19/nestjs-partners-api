import { NestFactory } from '@nestjs/core';
import { Parterner1Module } from './parterner1.module';

async function bootstrap() {
  const app = await NestFactory.create(Parterner1Module);
  await app.listen(3000);
}
bootstrap();
