import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Index, OneToOne, Relation, OneToMany } from "typeorm";
import { User as SharedUser } from "@athena/types"
import { IsEmail, Matches } from "class-validator";
import { USERNAME_REGEX } from "src/engine/auth/utils/auth.util";
import { Wallet } from "../wallet/entities/wallet.entity";
import { Order } from "../market/entities/order.entity";
import { Listing } from "../listing/entities/listing.entity";
import { Notification } from "src/engine/notification/notification.entity";

@Entity('user')
@Index('UQ_USER_USERNAME', ['username'], { unique: true })
@Index('UQ_USER_EMAIL', ['email'], { unique: true })
export class User implements SharedUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  bio?: string | null;

  @Column({ type: 'varchar' })
  @Matches(USERNAME_REGEX)
  username: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @IsEmail()
  @Column('varchar')
  email: string;

  @Column('varchar')
  passwordHash: string;

  @CreateDateColumn()
  createdAt: string;

  @DeleteDateColumn()
  deletedAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @OneToOne(() => Wallet, (wallet) => wallet.owner)
  wallet: Relation<Wallet>

  @OneToMany(() => Order, (transaction) => transaction.buyer)
  buyTransactions: Relation<Order[]>;


  @OneToMany(() => Order, (transaction) => transaction.seller)
  sellTransactions: Relation<Order[]>;

  @OneToMany(() => Listing, (listing) => listing.owner)
  listings: Relation<Listing[]>

  @OneToMany(() => Notification, (x) => x.user)
  notifications: Relation<Notification[]>


}
