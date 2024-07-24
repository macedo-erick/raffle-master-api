import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketsDto } from './dto/create-tickets.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../common/decorators/user/user.decorator';

@Controller('tickets')
@ApiTags('Ticket Resources')
export class TicketController {
  constructor(private readonly TicketService: TicketService) {}

  @Post()
  create(@User() userId: string, @Body() createTicketsDto: CreateTicketsDto) {
    return this.TicketService.sendCreateRequestToQueue(
      createTicketsDto,
      userId
    );
  }

  @Get(':raffleId')
  findAll(@User() userId: string, @Param('raffleId') raffleId: string) {
    return this.TicketService.findAllTicketsByUserRaffle(userId, raffleId);
  }
}
