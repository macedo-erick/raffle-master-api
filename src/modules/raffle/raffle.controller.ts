import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RaffleService } from './raffle.service';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';
import { RaffleStatus } from '../../common/constants/raffle-status.enum';
import { Public } from '../../common/decorators/public/public.decorator';
import { User } from '../../common/decorators/user/user.decorator';

@Controller('raffles')
@ApiTags('Raffles Resources')
export class RaffleController {
  constructor(private readonly raffleService: RaffleService) {}

  @Post()
  create(@Body() createRaffleDto: CreateRaffleDto) {
    return this.raffleService.create(createRaffleDto);
  }

  @Get()
  findAll(@User() userId: string) {
    return this.raffleService.findAllByUser(userId);
  }

  @Get('/pending')
  @Public()
  findAllPending() {
    return this.raffleService.findAllByStatus(RaffleStatus.PENDING);
  }

  @Get('/finished')
  @Public()
  findAllFinished() {
    return this.raffleService.findAllByStatus(RaffleStatus.FINISHED);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.raffleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRaffleDto: UpdateRaffleDto) {
    return this.raffleService.update(id, updateRaffleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.raffleService.remove(id);
  }
}
