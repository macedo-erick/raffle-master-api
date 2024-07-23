import { Test, TestingModule } from '@nestjs/testing';
import { RaffleImageService } from './raffle-image.service';

describe('RaffleImageService', () => {
  let service: RaffleImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RaffleImageService],
    }).compile();

    service = module.get<RaffleImageService>(RaffleImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
