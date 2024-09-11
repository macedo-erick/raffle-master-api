/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateTicketsDto } from './dto/create-tickets.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RaffleService } from '../raffle/raffle.service';
import { Ticket } from './entities/ticket.entity';
import { ProducerService } from '../queue/producer/producer.service';

@Injectable()
export class TicketService {
  private readonly logger = new Logger(TicketService.name);

  constructor(
    private readonly producerService: ProducerService,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @Inject(forwardRef(() => RaffleService))
    private readonly raffleService: RaffleService
  ) {}

  async sendCreateRequestToQueue(
    createTicketsDto: CreateTicketsDto,
    userId: string
  ) {
    await this.producerService.sendTicketToQueue({
      ...createTicketsDto,
      userId
    });

    return { message: 'Tickets created successfully' };
  }

  async create(createTicketsDto: CreateTicketsDto, userId: string) {
    const { maxTickets, ticketPrice } = await this.raffleService.findOne(
      createTicketsDto.raffleId
    );

    const randomNumbers = await this.generateRandomNumbers(
      createTicketsDto.raffleId,
      createTicketsDto.quantity,
      maxTickets * 2
    );

    const tickets = randomNumbers.map((number) => ({
      raffleId: createTicketsDto.raffleId,
      user: { id: userId },
      ticketPrice,
      number
    }));

    const numbers = await this.ticketRepository.insert(tickets);

    this.logger.log(
      `[${createTicketsDto.quantity}] tickets were created sucessfully for user [${userId}] in raffle [${createTicketsDto.raffleId}]`
    );

    return { numbers };
  }

  async findAllRafflesByUser(userId: string) {
    const raffles = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select(['raffle.*'])
      .where('ticket.userId = :userId', { userId })
      .distinct(true)
      .innerJoin('ticket.raffle', 'raffle')
      .getRawMany();

    return { raffles, count: raffles.length };
  }

  async findAllTicketsByUserRaffle(userId: string, raffleId: string) {
    const entries = await this.ticketRepository.find({
      where: { raffleId, user: { id: userId } },
      order: { number: 'ASC' }
    });

    const numbers = entries.map((ticket) => ticket.number);

    return { numbers, count: numbers.length };
  }

  existsByNumbers(raffleId: string, number: number[]) {
    return this.ticketRepository.find({
      where: {
        number: In(number)
      }
    });
  }

  private async generateRandomNumbers(
    raffleId: string,
    quantity: number,
    maxTickets: number
  ) {
    const numbers = new Set<number>();

    while (numbers.size < quantity) {
      const number = Math.floor(Math.random() * maxTickets) + 1;
      numbers.add(number);
    }

    const existingNumbers = await this.existsByNumbers(raffleId, [...numbers]);

    const uniqueNumbers = [...numbers].filter(
      (number) => !existingNumbers.some((ticket) => ticket.number === number)
    );

    const remainingQuantity = quantity - uniqueNumbers.length;

    if (remainingQuantity > 0) {
      const additionalNumbers = await this.generateRandomNumbers(
        raffleId,
        remainingQuantity,
        maxTickets
      );
      uniqueNumbers.push(...additionalNumbers);
    }

    return uniqueNumbers;
  }
}
