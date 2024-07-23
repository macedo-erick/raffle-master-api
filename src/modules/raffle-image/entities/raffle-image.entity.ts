import { Raffle } from '../../raffle/entities/raffle.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class RaffleImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  alternateText: string;

  @Column()
  url: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(() => Raffle)
  raffle: Raffle;
}
