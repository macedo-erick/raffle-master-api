import { Injectable } from '@nestjs/common';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';
import { Repository } from 'typeorm';
import { Raffle } from './entities/raffle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RaffleStatus } from '../../common/constants/raffle-status.enum';

@Injectable()
export class RaffleService {
  constructor(
    @InjectRepository(Raffle)
    private readonly raffleRepository: Repository<Raffle>
  ) {}

  create(createRaffleDto: CreateRaffleDto) {
    return this.raffleRepository.save(createRaffleDto);
  }

  findAllByStatus(status: RaffleStatus) {
    return this.raffleRepository.find({
      where: { status },
      order: { raffleDate: 'ASC' }
    });
  }

  findOne(id: string) {
    return this.raffleRepository.findOne({ where: { id } });
  }

  update(id: string, updateRaffleDto: UpdateRaffleDto) {
    return this.raffleRepository.update({ id }, updateRaffleDto);
  }

  remove(id: string) {
    return this.raffleRepository.delete({ id });
  }
}
