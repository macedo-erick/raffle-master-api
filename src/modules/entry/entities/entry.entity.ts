import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Raffle } from '../../raffle/entities/raffle.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Entry {
  @PrimaryColumn()
  number: number;

  @PrimaryColumn({ name: 'raffleId', type: 'string' })
  @ManyToOne(() => Raffle)
  @JoinColumn()
  raffle: Raffle;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
