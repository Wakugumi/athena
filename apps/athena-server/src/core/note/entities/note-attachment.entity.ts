import { NoteAttachment as INoteAttachment } from "@athena/types";
import { Column, CreateDateColumn, Entity, ForeignKey, Index, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Note } from "./note.entity";
import { ContentTypes } from "src/engine/storage/types/storage.types";

@Entity('attachment')
@Index('UQ_ATTACHMENT_KEY', ['key'], { unique: true })
export class NoteAttachment implements INoteAttachment {


  @PrimaryGeneratedColumn()
  id: string;


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
