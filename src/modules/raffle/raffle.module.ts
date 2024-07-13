import { Global, Module } from '@nestjs/common';
import { RaffleService } from './raffle.service';
import { RaffleController } from './raffle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Raffle } from './entities/raffle.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Raffle])],
  controllers: [RaffleController],
  providers: [RaffleService],
  exports: [RaffleService]
})
export class RaffleModule {}
