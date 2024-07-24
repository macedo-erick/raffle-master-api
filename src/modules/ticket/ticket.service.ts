/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateTicketsDto } from './dto/create-tickets.dto';
import { Repository } from 'typeorm';
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
      createTicketsDto.quantity,
      maxTickets
    );

    const tickets = randomNumbers.map((number) => ({
      raffle: { id: createTicketsDto.raffleId },
      user: { id: userId },
      ticketPrice,
      number
    }));

    const numbers = await this.ticketRepository
      .save(tickets)
      .then((entries) => entries.map((entry) => entry.number));

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
    const entries = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select('ticket.number')
      .where('ticket.raffleId = :raffleId and ticket.userId = :userId', {
        raffleId,
        userId
      })
      .orderBy('ticket.number', 'ASC')
      .getMany();

    const numbers = entries.map((ticket) => ticket.number);

    return { numbers, count: numbers.length };
  }

  existsByNumber(number: number) {
    return this.ticketRepository.existsBy({ number });
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
