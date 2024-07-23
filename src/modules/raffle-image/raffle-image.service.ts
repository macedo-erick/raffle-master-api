import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RaffleImage } from './entities/raffle-image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RaffleImageService {
  constructor(
    @InjectRepository(RaffleImage)
    private readonly repository: Repository<RaffleImage>
  ) {}

  findAll(raffleId: string) {
    return this.repository.find({ where: { raffle: { id: raffleId } } });
  }
}
