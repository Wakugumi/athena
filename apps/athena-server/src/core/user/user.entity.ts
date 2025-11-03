import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Index } from "typeorm";
import { User as SharedUser } from "@athena/types"
import { UUID } from "crypto";
import { IsEmail, Matches } from "class-validator";
import { USERNAME_REGEX } from "src/engine/auth/utils/auth.util";

@Entity('user')
@Index('UQ_USER_USERNAME', ['username'], { unique: true })
@Index('UQ_USER_EMAIL', ['email'], { unique: true })
export class User implements SharedUser {
  @PrimaryGeneratedColumn()
  id: string | UUID;

  @Column({ type: 'varchar' })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  bio?: string | null;

  @Column({ type: 'varchar' })
  @Matches(USERNAME_REGEX)
  username: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @IsEmail()
  @Column('varchar')
  email: string;

  @Column('varchar')
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


}
