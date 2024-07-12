import { Module } from '@nestjs/common';
import { RaffleService } from './raffle.service';
import { RaffleController } from './raffle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Raffle } from './entities/raffle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Raffle])],
  controllers: [RaffleController],
  providers: [RaffleService]
})
export class RaffleModule {}
