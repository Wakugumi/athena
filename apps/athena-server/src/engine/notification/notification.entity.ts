
import { NotificationCategory } from '@athena/types';
import { User } from 'src/core/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Relation, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (x) => x.notifications)
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @Column()
  message: string;

  @Column({ type: "enum", enum: NotificationCategory })
  category: NotificationCategory

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
