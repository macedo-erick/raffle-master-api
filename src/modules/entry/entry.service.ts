/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateEntryDto } from './dto/create-entry.dto';
import { Repository } from 'typeorm';
import { Entry } from './entities/entry.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RaffleService } from '../raffle/raffle.service';

@Injectable()
export class EntryService {
  constructor(
    @InjectRepository(Entry)
    private readonly entryRepository: Repository<Entry>,
    @Inject(forwardRef(() => RaffleService))
    private readonly raffleService: RaffleService
  ) {}

  async create(createEntryDto: CreateEntryDto) {
    const randomNumbers = await Promise.all(
      Array.from({ length: createEntryDto.numbersCount }).map(
        async () => await this.generateRandomNumber(createEntryDto.raffleId)
      )
    );

    const entries = randomNumbers.map((number) => ({
      raffle: { id: createEntryDto.raffleId },
      user: { id: createEntryDto.userId },
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
    const entries = await this.entryRepository.find({
      where: { user: { id: userId }, raffle: { id: raffleId } },
      select: ['number']
    });

    const numbers = entries.map((entry) => entry.number);

    return { numbers, counts: numbers.length };
  }

  existsByNumber(number: number) {
    return this.entryRepository.existsBy({ number });
  }

  async generateRandomNumber(raffleId: string): Promise<number> {
    const { maxEntries } = await this.raffleService.findOne(raffleId);

    const number = Math.floor(Math.random() * maxEntries) + 1;

    const existsByNumber = await this.existsByNumber(number);

    if (existsByNumber) {
      return await this.generateRandomNumber(raffleId);
    }

    return number;
  }
}
