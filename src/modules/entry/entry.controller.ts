import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EntryService } from './entry.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../common/decorators/user/user.decorator';

@Controller('entries')
@ApiTags('Entry Resources')
export class EntryController {
  constructor(private readonly entryService: EntryService) {}

  @Post()
  create(@Body() createEntryDto: CreateEntryDto) {
    return this.entryService.create(createEntryDto);
  }

  @Get(':raffleId')
  findAll(@User() userId: string, @Param('raffleId') raffleId: string) {
    return this.entryService.findAllEntriesByUserRaffle(userId, raffleId);
  }
}
