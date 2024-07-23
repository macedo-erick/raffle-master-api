/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateEntriesDto } from './dto/create-entries.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RaffleService } from '../raffle/raffle.service';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly entryRepository: Repository<Ticket>,
    @Inject(forwardRef(() => RaffleService))
    private readonly raffleService: RaffleService
  ) {}

  async create(createEntryDto: CreateEntriesDto, userId: string) {
    const { maxTickets, ticketPrice } = await this.raffleService.findOne(
      createEntryDto.raffleId
    );

    const randomNumbers = await this.generateRandomNumbers(
      createEntryDto.quantity,
      maxTickets
    );

    const entries = randomNumbers.map((number) => ({
      raffle: { id: createEntryDto.raffleId },
      user: { id: userId },
      ticketPrice,
      number
    }));

    const numbers = await this.entryRepository
      .save(entries)
      .then((entries) => entries.map((entry) => entry.number));

    return { numbers };
  }

  async findAllRafflesByUser(userId: string) {
    const raffles = await this.entryRepository
      .createQueryBuilder('entry')
      .select(['raffle.*'])
      .where('entry.userId = :userId', { userId })
      .distinct(true)
      .innerJoin('entry.raffle', 'raffle')
      .getRawMany();

    return { raffles, count: raffles.length };
  }

  async findAllEntriesByUserRaffle(userId: string, raffleId: string) {
    const entries = await this.entryRepository
      .createQueryBuilder('entry')
      .select('entry.number')
      .where('entry.raffleId = :raffleId and entry.userId = :userId', {
        raffleId,
        userId
      })
      .orderBy('entry.number', 'ASC')
      .getMany();

    const numbers = entries.map((entry) => entry.number);

    return { numbers, count: numbers.length };
  }

  existsByNumber(number: number) {
    return this.entryRepository.existsBy({ number });
  }

  private async generateRandomNumbers(quantity: number, maxTickets: number) {
    const numbers = Array.from({ length: quantity });

    return Promise.all(
      numbers.map(async () => await this.generateRandomNumber(maxTickets))
    );
  }

  private async generateRandomNumber(maxTickets: number): Promise<number> {
    const number = Math.floor(Math.random() * maxTickets * 2) + 1;

    const existsByNumber = await this.existsByNumber(number);

    if (existsByNumber) {
      return await this.generateRandomNumber(maxTickets);
    }

    return number;
  }
}
