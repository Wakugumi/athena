import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Listing } from "./listing.entity";
import { ContentTypes, ListingItem as IListing } from '@athena/types'
import { randomUUID } from "crypto";

@Entity('listing_item')
export class ListingItem implements IListing {
  @PrimaryColumn('uuid')
  id: string = randomUUID()

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

  @Column({ type: 'enum', enum: ContentTypes, nullable: true })
  contentType?: ContentTypes | null;

  @Column({ type: 'text', nullable: true })
  preview?: string | null

  @CreateDateColumn()
  createdAt: string;

  @DeleteDateColumn()
  deletedAt?: string;
}
