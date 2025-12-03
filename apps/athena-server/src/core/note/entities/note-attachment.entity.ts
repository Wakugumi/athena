import { ContentTypes, NoteAttachment as INoteAttachment } from "@athena/types";
import { Column, CreateDateColumn, Entity, ForeignKey, Index, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Note } from "./note.entity";
import { randomUUID } from "crypto";
@Entity('attachment')
@Index('UQ_ATTACHMENT_KEY', ['key'], { unique: true })
export class NoteAttachment implements INoteAttachment {

  @PrimaryColumn('uuid')
  id: string = randomUUID()


  @Column({ type: 'enum', enum: ContentTypes, enumName: "content_types" })
  contentType: ContentTypes;

  @Column()
  key: string;

  @Column()
  noteId: string;

  @OneToOne(() => Note, (note) => note.attachments)
  note: Relation<Note>;


  @Column()
  size: number;

  @Column()
  originalFilename: string;

  @Column()
  url: string;

  @CreateDateColumn()
  createdAt: string;

}
