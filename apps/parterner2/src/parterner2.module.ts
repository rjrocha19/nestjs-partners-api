import { Module } from '@nestjs/common';
import { Parterner2Controller } from './parterner2.controller';
import { Parterner2Service } from './parterner2.service';

@Module({
  imports: [],
  controllers: [Parterner2Controller],
  providers: [Parterner2Service],
})
export class Parterner2Module {}
