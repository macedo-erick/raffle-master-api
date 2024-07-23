import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EntryService } from './entry.service';
import { CreateEntriesDto } from './dto/create-entries.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../common/decorators/user/user.decorator';

@Controller('entries')
@ApiTags('Entry Resources')
export class EntryController {
  constructor(private readonly entryService: EntryService) {}

  @Post()
  create(@User() userId: string, @Body() createEntryDto: CreateEntriesDto) {
    return this.entryService.create(createEntryDto, userId);
  }

  @Get(':raffleId')
  findAll(@User() userId: string, @Param('raffleId') raffleId: string) {
    return this.entryService.findAllEntriesByUserRaffle(userId, raffleId);
  }
}
