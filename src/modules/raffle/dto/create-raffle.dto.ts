import { ApiProperty } from '@nestjs/swagger';

export class CreateRaffleDto {
  name: string;

  description: string;

  raffleDate: Date;

  maxEntries: number;
}
