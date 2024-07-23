import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { RaffleStatus } from '../../../common/constants/raffle-status.enum';
import { User } from '../../user/entities/user.entity';
import { RaffleImage } from '../../raffle-image/entities/raffle-image.entity';

@Entity({ name: 'raffle' })
export class Raffle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ length: 5000 })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  prizeValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  ticketPrice: number;

  @Column({ type: 'datetime' })
  raffleDate: Date;

  @Column()
  maxTickets: number;

  @Column({ type: 'enum', enum: RaffleStatus, default: RaffleStatus.PENDING })
  status: RaffleStatus;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToOne(() => User)
  @JoinColumn()
  winner: User;

  @ManyToOne(() => User)
  @JoinColumn()
  createdBy: User;

  @OneToMany(() => RaffleImage, (raffleImage) => raffleImage.raffle)
  images: RaffleImage[];
}
