import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { RaffleStatus } from '../../../common/constants/raffle-status.enum';

@Entity({ name: 'raffle' })
export class Raffle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ length: 5000 })
  description: string;

  @Column({ type: 'datetime' })
  raffleDate: Date;

  @Column()
  maxEntries: number;

  @Column({ type: 'enum', enum: RaffleStatus, default: RaffleStatus.PENDING })
  status: RaffleStatus;

  @Column({ length: 36, nullable: true })
  winner: string;

  @Column({ length: 36, nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
