import { Global, Module } from '@nestjs/common';
import { RaffleImageService } from './raffle-image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaffleImage } from './entities/raffle-image.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([RaffleImage])],
  controllers: [],
  providers: [RaffleImageService],
  exports: [RaffleImageService]
})
export class RaffleImageModule {}
