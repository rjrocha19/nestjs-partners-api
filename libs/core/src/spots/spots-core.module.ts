import { Module } from '@nestjs/common';
import { SpotsService } from './spots.service';

@Module({
  controllers: [],
  providers: [SpotsService],
})
export class SpotsCoreModule {}
