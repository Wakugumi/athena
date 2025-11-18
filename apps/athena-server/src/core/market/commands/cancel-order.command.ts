import { PublicOrder } from "@athena/types";
import { Command } from "@nestjs/cqrs";

export class CancelOrderCommand extends Command<{ order: PublicOrder }> {
  constructor(
    /**
     * order id to be revoke
     */
    public readonly orderId: string,
    /**
     * id of the user who request this command
     */
    public readonly userId: string
  ) { super(); }
}
