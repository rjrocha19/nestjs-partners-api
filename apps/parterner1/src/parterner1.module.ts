import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { SpotsModule } from './spots/spots.module';

@Module({
  imports: [EventsModule, SpotsModule],
})
export class Parterner1Module {}
