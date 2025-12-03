
import { NotificationCategory, Notification as INotification } from '@athena/types';
import { randomUUID } from 'crypto';
import { User } from 'src/core/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Relation, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Notification implements INotification {
  @PrimaryColumn('uuid')
  id: string = randomUUID()

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
