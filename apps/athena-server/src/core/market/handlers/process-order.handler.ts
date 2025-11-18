import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ProcessOrderCommand } from "../commands/process-order.command";
import { OrderService } from "../services/order.service";
import { PublicOrder } from "@athena/types";
import { OrderOwnersipService } from "../services/order-ownership.service";

@CommandHandler(ProcessOrderCommand)
export class ProcessOrderHandler implements ICommandHandler<ProcessOrderCommand> {
  constructor(private readonly orderOwnersipService: OrderOwnersipService, private readonly orderService: OrderService) {
  }


  async execute(command: ProcessOrderCommand): Promise<{ order: PublicOrder; }> {
    await this.orderOwnersipService.ensureSellerOwns(command.orderId, command.userId)
    const order = await this.orderService.processOrder(command.orderId);

    return {
      order: order as PublicOrder
    }
  }
}
