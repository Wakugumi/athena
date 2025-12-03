import { Currency, Listing as IListing, License, ListingStatus, PublicUser, Visibility } from "@athena/types"
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm"
import { ListingItem } from "./listing-item.entity";
import { User } from "src/core/user/user.entity";
import { Order } from "src/core/market/entities/order.entity";
import { randomUUID } from "crypto";


@Entity('listing')
@Index("IDX_LISTING_TITLE", ['title'])
export class Listing implements IListing {
  @PrimaryColumn('uuid')
  id: string = randomUUID()


  @Column()
  ownerId: string;

  @ManyToOne(() => User, (user) => user.listings)
  @JoinColumn({ name: 'ownerId' })
  owner: Relation<User>;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: "enum", enum: Visibility, enumName: "visibility", default: Visibility.DRAFT })
  visibility: Visibility;

  @Column({ type: "enum", enum: License, enumName: 'license', default: License.OPEN })
  license: License;

  @OneToMany(() => ListingItem, (item) => item.listing)
  items: Relation<ListingItem[]>


  @Column({ type: 'text', nullable: true })
  preview?: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  price: number;


  @Column({ type: "enum", enum: Currency, enumName: "currency", default: Currency.TOKEN })
  currency: Currency;

  @Column({ type: 'float', default: 0 })
  rating?: number


  @Column({ type: 'text', default: "" })
  summary: string;


  @Column({ default: 0 })
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
  publishedAt?: string | null;


  @OneToMany(() => Order, (order) => order.listing)
  orders: Relation<Order[]>


  @Column({ type: "enum", enum: ListingStatus, enumName: "listing_status", default: ListingStatus.DRAFT })
  status: ListingStatus

  @Column({ type: 'int', default: 0 })
  itemsProcessedCount: number

  @Column({ type: "int", default: 0 })
  itemsExpectedCount: number;

  @Column({
    type: 'int',
  })
  number: number;

}
