import { PublicOrder } from "@athena/types";
import { Command } from "@nestjs/cqrs";

export class CreateOrderCommand extends Command<{ order: PublicOrder }> {
  constructor(
    public readonly listingId: string,
    public readonly buyerId: string
  ) { super() }

}
