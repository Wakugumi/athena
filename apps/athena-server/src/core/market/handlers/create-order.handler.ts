import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateOrderCommand } from "../commands/create-order.command";
import { OrderService } from "../services/order.service";
import { PublicOrder } from "@athena/types";

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(private readonly orderService: OrderService) { }

  async execute(command: CreateOrderCommand): Promise<{ order: PublicOrder; }> {
    const order = await this.orderService.createOrder({ buyerId: command.buyerId, listingId: command.listingId });

    return {
      order: order as PublicOrder
    }

  }
}
