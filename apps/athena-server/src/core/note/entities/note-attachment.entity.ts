import { ContentTypes, NoteAttachment as INoteAttachment } from "@athena/types";
import { Column, CreateDateColumn, ForeignKey, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Note } from "./note.entity";

export class NoteAttachment implements INoteAttachment {
  @PrimaryGeneratedColumn()
  id: string;


  @Column({ type: 'enum', enum: ContentTypes })
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
  createdAt: Date;

}
