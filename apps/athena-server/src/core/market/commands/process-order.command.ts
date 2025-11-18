import { PublicOrder } from "@athena/types";
import { Command } from "@nestjs/cqrs";

export class ProcessOrderCommand extends Command<{ order: PublicOrder }> {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
  ) {
    super();
  }
}
