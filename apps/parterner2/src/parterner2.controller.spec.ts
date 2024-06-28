import { Test, TestingModule } from '@nestjs/testing';
import { Parterner2Controller } from './parterner2.controller';
import { Parterner2Service } from './parterner2.service';

describe('Parterner2Controller', () => {
  let parterner2Controller: Parterner2Controller;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [Parterner2Controller],
      providers: [Parterner2Service],
    }).compile();

    parterner2Controller = app.get<Parterner2Controller>(Parterner2Controller);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(parterner2Controller.getHello()).toBe('Hello World!');
    });
  });
});
