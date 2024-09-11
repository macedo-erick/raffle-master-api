/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';
import { Repository } from 'typeorm';
import { Raffle } from './entities/raffle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RaffleStatus } from '../../common/constants/raffle-status.enum';
import { TicketService } from '../ticket/ticket.service';

@Injectable()
export class RaffleService {
  constructor(
    @InjectRepository(Raffle)
    private readonly raffleRepository: Repository<Raffle>,
    @Inject(forwardRef(() => TicketService))
    private readonly ticketService: TicketService
  ) {}

  create(createRaffleDto: CreateRaffleDto) {
    return this.raffleRepository.save({
      ...createRaffleDto,
      createdBy: { id: createRaffleDto.createdBy }
    });
  }

  async findAllByStatus(status: RaffleStatus) {
    return await this.raffleRepository.find({
      where: { status },
      order: { raffleDate: 'ASC' },
      relations: ['createdBy'],
      select: {
        createdBy: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    });
  }

  findOne(id: string) {
    return this.raffleRepository.findOne({
      where: { id },
      relations: ['images', 'createdBy'],
      select: {
        createdBy: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true
        }
      }
    });
  }

  update(id: string, updateRaffleDto: UpdateRaffleDto) {
    return this.raffleRepository.update({ id }, updateRaffleDto);
  }

  remove(id: string) {
    return this.raffleRepository.delete({ id });
  }

  findAllByUser(userId: string) {
    return this.ticketService.findAllRafflesByUser(userId);
  }
}
