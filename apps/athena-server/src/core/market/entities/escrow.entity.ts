import { EscrowStatus, Escrow as IEscrow } from '@athena/types'
import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('escrow')
@Index('UQ_ESCROW_ORDER_ID', ['orderId'], { unique: true })
export class Escrow implements IEscrow {
  @PrimaryGeneratedColumn()
  id: string;


  @Column()
  orderId: string;

  @OneToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Relation<Order>


  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: EscrowStatus, enumName: "escrow_status" })
  status: EscrowStatus;


  @Column({ type: 'date', nullable: true })
  holdUntil?: string | null;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

}
