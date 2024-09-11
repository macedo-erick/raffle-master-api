import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Raffle } from '../../raffle/entities/raffle.entity';

@Entity()
export class Ticket {
  @PrimaryColumn()
  number: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  ticketPrice: number;

  @PrimaryColumn({ name: 'raffleId', type: 'varchar' })
  raffleId: string;

  @ManyToOne(() => Raffle)
  @JoinColumn()
  raffle: Raffle;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
