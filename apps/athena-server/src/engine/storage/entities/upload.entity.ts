import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UploadStatus } from "../enums/upload-status.enum";
import { ContentTypes } from "@athena/types";
import { UploadPurpose } from "../enums/upload-purpose.enum";
import { UploadDomain } from "../enums/upload-domain.enum";

@Entity('upload')
export class UploadEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  key: string;

  @Column({ type: "enum", enum: UploadPurpose })
  purpose: UploadPurpose

  @Column({ type: "enum", enum: UploadDomain })
  domain: UploadDomain;

  @Column({ type: 'enum', enumName: 'upload_status', enum: UploadStatus, default: UploadStatus.PENDING })
  status: UploadStatus;

  @Column({ type: 'varchar' })
  referenceId: string

  @Column({ type: 'bigint', nullable: true })
  size?: number | null;

  @Column({ type: 'enum', enumName: "content_type", enum: ContentTypes })
  contentType?: ContentTypes | null;

  @Column({ type: 'varchar', nullable: true })
  checksum?: string | null;

  @Column({ type: "text", nullable: true })
  error?: string | null;

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string;

}
