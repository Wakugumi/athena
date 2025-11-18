import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Listing } from "./listing.entity";
import { ListingItem as IListing } from '@athena/types'

@Entity('listing_item')
export class ListingItem implements IListing {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  listingId: string;

  @ManyToOne(() => Listing, (list) => list.items)
  @JoinColumn({ name: 'listingId' })
  listing: Relation<Listing>

  @Column()
  title: string;

  @Column()
  blobKey: string;

  @CreateDateColumn()
  createdAt: string;

  @DeleteDateColumn()
  deletedAt?: string;
}
