import { Body, Controller, Param, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiBody, ApiParam } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/engine/auth/guards/auth-jwt.guard";
import { PurcaseInputDto } from "../dtos/purchase.input";
import { CreateOrderCommand } from "../commands/create-order.command";
import { CurrentUser } from "src/engine/auth/decorators/current-user.decorator";
import { User } from "src/core/user/user.entity";
import { ProcessOrderCommand } from "../commands/process-order.command";
import { CancelOrderCommand } from "../commands/cancel-order.command";

@Controller('order')
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private commandBus: CommandBus) { }

  @Post('create')
  @ApiBody({ type: PurcaseInputDto })
  @ApiBearerAuth()
  async create(@Body() payload: PurcaseInputDto, @CurrentUser() user: User) {
    return this.commandBus.execute(
      new CreateOrderCommand(payload.listingId, user.id)
    )

  }

  @Post('process/:orderId')
  @ApiParam({ name: 'orderId', type: "string" })
  @ApiBearerAuth()
  async process(@Param('orderId') orderId: string, @CurrentUser() user: User) {
    return this.commandBus.execute(
      new ProcessOrderCommand(orderId, user.id)
    )
  }

  @Post('cancel/:orderId')
  @ApiParam({ name: 'orderId', type: "string" })
  @ApiBearerAuth()
  async cancel(@Param('orderId') orderId: string, @CurrentUser() user: User) {
    return this.commandBus.execute(
      new CancelOrderCommand(orderId, user.id)
    )
  }

}
