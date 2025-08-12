import { Test, TestingModule } from '@nestjs/testing';
import { BaseDaoService } from './base-dao.service';

describe('BaseDaoService', () => {
  let service: BaseDaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();

    service = module.get<BaseDaoService>(BaseDaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
