import { Currency, Listing as IListing, License, ListingStatus, Visibility } from "@athena/types"
import { Column, CreateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm"
import { Order } from "./order.entity";
import { ListingItem } from "./listing-item.entity";
import { User } from "src/core/user/user.entity";


export class Listing implements IListing {
  @PrimaryGeneratedColumn()
  id: string;



  @Column({ type: 'string' })
  sellerId: string;

  @OneToOne(() => User, (user) => user.listings)
  seller: Relation<User>;

  @Column({ type: 'string' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: "enum", enum: Visibility })
  visibility: Visibility;

  @Column({ type: "enum", enum: License })
  license: License;

  @OneToMany(() => ListingItem, (item) => item.listing)
  items: Relation<ListingItem[]>


  @Column({ type: 'text' })
  preview?: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  price: number;


  @Column({ type: "enum", enum: Currency })
  currency: Currency;

  @Column({ type: 'float' })
  rating?: number | undefined;


  @Column({ type: 'text' })
  summary: string;


  @Column({ type: 'number' })
  downloads: number;

  @UpdateDateColumn()
  updatedAt: string;

  @CreateDateColumn()
  createdAt: string;

  @Column({ type: 'timestamptz', nullable: true })
  archivedAt?: string | undefined;

  @DeleteDateColumn()
  removedAt?: string | undefined;

  @Column({ type: 'timestamptz', nullable: true })
  publishedAt?: string | undefined;


  @OneToMany(() => Order, (order) => order.listing)
  orders: Relation<Order[]>


  @Column({ type: "enum", enum: ListingStatus })
  status: ListingStatus

  @Column({ default: 0 })
  itemsProcessedCount: number

  @Column({ default: 0 })
  itemsExpectedCount: number;


}
