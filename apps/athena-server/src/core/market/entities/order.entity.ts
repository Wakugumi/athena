import { OrderStatus, Order as OrderType } from '@athena/types';
import { User } from 'src/core/user/user.entity';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from 'typeorm';
import { Escrow } from './escrow.entity';
import { Listing } from 'src/core/listing/entities/listing.entity';
import { randomUUID } from 'crypto';

@Entity('order')
@Index('UQ_ORDER_ESCROW_ID', ['escrowId'], { unique: true })
export class Order implements OrderType {
  @PrimaryColumn('uuid')
  id: string = randomUUID()


  @Column()
  listingId: string;

  @ManyToOne(() => Listing, (listing) => listing.orders)
  @JoinColumn({ name: 'listingId' })
  listing: Relation<Listing>;

  @Column()
  buyerId: string;

  @ManyToOne(() => User, (user) => user.buyTransactions)
  @JoinColumn({ name: 'buyerId' })
  buyer: Relation<User>

  @Column()
  sellerId: string;

  @ManyToOne(() => User, (user) => user.sellTransactions)
  @JoinColumn({ name: 'sellerId' })
  seller: Relation<User>

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;


  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Column({ type: 'varchar', nullable: true })
  completedAt?: string | null


  @Column({ type: 'varchar', nullable: true })
  refundedAt?: string | null;

  @Column()
  escrowId: string;

  @OneToOne(() => Escrow, (escrow) => escrow.order)
  @JoinColumn({ name: 'escrowId' })
  escrow: Relation<Escrow>

  @Column({ type: 'enum', enum: OrderStatus, enumName: 'order_status' })
  status: OrderStatus;




}
