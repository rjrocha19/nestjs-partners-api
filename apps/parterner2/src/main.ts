import { NestFactory } from '@nestjs/core';
import { Parterner2Module } from './parterner2.module';

async function bootstrap() {
  const app = await NestFactory.create(Parterner2Module);
  await app.listen(3001);
}
bootstrap();
