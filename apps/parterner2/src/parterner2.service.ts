import { Injectable } from '@nestjs/common';

@Injectable()
export class Parterner2Service {
  getHello(): string {
    return 'Hello World!';
  }
}
