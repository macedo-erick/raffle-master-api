import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateEntriesDto } from './dto/create-entries.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../common/decorators/user/user.decorator';

@Controller('tickets')
@ApiTags('Ticket Resources')
export class TicketController {
  constructor(private readonly TicketService: TicketService) {}

  @Post()
  create(@User() userId: string, @Body() createEntryDto: CreateEntriesDto) {
    return this.TicketService.create(createEntryDto, userId);
  }

  @Get(':raffleId')
  findAll(@User() userId: string, @Param('raffleId') raffleId: string) {
    return this.TicketService.findAllEntriesByUserRaffle(userId, raffleId);
  }
}
