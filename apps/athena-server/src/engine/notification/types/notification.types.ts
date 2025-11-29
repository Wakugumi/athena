import { NotificationCategory } from "@athena/types";


export class NotificationEventPayload {
  constructor(

    public readonly userId: string,
    public readonly category: NotificationCategory,
    public readonly message: string,
    public readonly meta?: Record<string, any>
  ) { }
};
