import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { RaffleStatus } from '../../../common/constants/raffle-status.enum';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'raffle' })
export class Raffle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ length: 5000 })
  description: string;

  @Column({ type: 'decimal', default: 0 })
  prizeValue: number;

  @Column({ type: 'decimal', default: 0 })
  entryValue: number;

  @Column({ type: 'datetime' })
  raffleDate: Date;

  @Column()
  maxEntries: number;

  @Column({ type: 'enum', enum: RaffleStatus, default: RaffleStatus.PENDING })
  status: RaffleStatus;

  @OneToOne(() => User)
  @JoinColumn()
  winner: User;

  @ManyToOne(() => User)
  @JoinColumn()
  createdBy: User;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
