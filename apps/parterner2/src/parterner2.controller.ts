import { Controller, Get } from '@nestjs/common';
import { Parterner2Service } from './parterner2.service';

@Controller()
export class Parterner2Controller {
  constructor(private readonly parterner2Service: Parterner2Service) {}

  @Get()
  getHello(): string {
    return this.parterner2Service.getHello();
  }
}
