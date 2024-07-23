import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Raffle } from '../../raffle/entities/raffle.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Ticket {
  @PrimaryColumn()
  number: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  ticketPrice: number;

  @PrimaryColumn({ name: 'raffleId', type: 'string' })
  @ManyToOne(() => Raffle)
  @JoinColumn()
  raffle: Raffle;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
