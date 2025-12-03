import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { AIMetadata, Collaborator, Note as NoteType } from '@athena/types'
import { NoteAttachment } from "./note-attachment.entity";
import { randomUUID } from "crypto";

@Entity('note')
export class Note implements NoteType {
  @PrimaryColumn('uuid')
  id: string = randomUUID()

  @Column()
  title: string;

  @Column({ type: 'text', default: "" })
  content: string;

  @Column({ type: 'text', nullable: true })
  summary?: string | null;

  @Column({ type: 'jsonb' })
  embeddingVector?: number[] | null;

  @OneToMany(() => NoteAttachment, (x) => x.note)
  attachments: Relation<NoteAttachment[]>

  @Column({ type: 'text', array: true })
  tags: string[];

  @Column({ type: 'varchar', nullable: true })
  folderId?: string | null;

  @Column({ type: 'boolean', default: false })
  isPinned: boolean;


  @Column({ type: 'boolean', default: false })
  isArchived: boolean;


  @Column({ type: 'boolean', default: false })
  isTrashed: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string

  @DeleteDateColumn()
  deletedAt?: string

  @Column()
  ownerId: string;
}
