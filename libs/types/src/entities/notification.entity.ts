import { NotificationCategory } from "../enums";
import { UserWithoutPassword } from "./user.entity";

export interface Notification {
  id: string;

  userId: string;

  user?: UserWithoutPassword | null;

  message: string;

  category: NotificationCategory;

  read: boolean;

  createdAt: Date;

}
