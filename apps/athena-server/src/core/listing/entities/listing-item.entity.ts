import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Listing } from "./listing.entity";
import { ListingItem as IListing } from '@athena/types'

@Entity('listing_item')
export class ListingItem implements IListing {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar' })
  listingId: string;

  @ManyToOne(() => Listing, (list) => list.items)
  @JoinColumn({ name: 'listingId' })
  listing: Relation<Listing>

  @Column({ type: 'varchar' })
  title: string;


  @Column({ type: 'varchar', default: 'PENDING' })
  status: "PENDING" | "READY";

  @Column({ type: "varchar", nullable: true })
  blobKey?: string | null;

  @Column({ type: 'text', nullable: true })
  preview?: string | null

  @CreateDateColumn()
  createdAt: string;

  @DeleteDateColumn()
  deletedAt?: string;
}
