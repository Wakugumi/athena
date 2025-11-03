import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AIMetadata, Collaborator, Note as NoteType } from '@athena/types'

@Entity('note')
export class Note implements NoteType {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  summary?: string | null;

  @Column({ type: 'jsonb' })
  embeddingVector?: number[] | null;

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

  @Column({ type: 'jsonb', array: true })
  collaborators?: Collaborator[] | undefined;

  @Column({ type: 'jsonb' })
  aiMetadata?: AIMetadata | undefined;







}
