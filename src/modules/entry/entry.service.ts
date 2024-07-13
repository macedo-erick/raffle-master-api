/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
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
    private readonly raffleService: RaffleService
  ) {}

  async create(createEntryDto: CreateEntryDto) {
    const numbers = await Promise.all(
      Array.from({ length: createEntryDto.numbersCount }).map(
        async () => await this.generateRandomNumber(createEntryDto.raffleId)
      )
    );

    const entries = numbers.map((number) => ({
      raffle: { id: createEntryDto.raffleId },
      user: { id: createEntryDto.userId },
      number
    }));

    const savedNumbers = await this.entryRepository
      .save(entries)
      .then((entries) => entries.map((entry) => entry.number));

    return { numbers: savedNumbers };
  }

  async findAll(userId: string, raffleId: string) {
    const entries = await this.entryRepository.find({
      where: { user: { id: userId }, raffle: { id: raffleId } },
      select: ['number']
    });

    const numbers = entries.map((entry) => entry.number);

    return { numbers };
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
