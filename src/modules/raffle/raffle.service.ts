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
    private readonly TicketService: TicketService
  ) {}

  create(createRaffleDto: CreateRaffleDto) {
    return this.raffleRepository.save({
      ...createRaffleDto,
      createdBy: { id: createRaffleDto.createdBy }
    });
  }

  async findAllByStatus(status: RaffleStatus) {
    const res = await this.raffleRepository.find({
      where: { status },
      order: { raffleDate: 'ASC' },
      relations: ['createdBy']
    });

    return res.map(({ createdBy: { id, firstName, lastName }, ...raffle }) => ({
      ...raffle,
      createdBy: { id, firstName, lastName }
    }));
  }

  findOne(id: string) {
    return this.raffleRepository
      .createQueryBuilder('raffle')
      .select([
        'user.id',
        'user.firstName',
        'lastName',
        'user.email',
        'user.phone',
        'raffle.id',
        'raffle.name',
        'raffle.description',
        'raffle.raffleDate',
        'raffle.maxTickets',
        'raffle.status',
        'raffle.winnerId',
        'raffle.createdDate',
        'raffle.prizeValue',
        'raffle.ticketPrice',
        'image.url',
        'image.alternateText',
        'image.createdDate'
      ])
      .where('raffle.id = :id', { id })
      .innerJoin('raffle.createdBy', 'user')
      .innerJoin('raffle.images', 'image')
      .getOne();
  }

  update(id: string, updateRaffleDto: UpdateRaffleDto) {
    return this.raffleRepository.update({ id }, updateRaffleDto);
  }

  remove(id: string) {
    return this.raffleRepository.delete({ id });
  }

  findAllByUser(userId: string) {
    return this.TicketService.findAllRafflesByUser(userId);
  }
}
