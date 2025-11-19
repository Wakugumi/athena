import { Controller, Get, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiOkResponse, ApiOperation, ApiResponse, } from "@nestjs/swagger";
import { CurrentUser } from "src/engine/auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/engine/auth/guards/auth-jwt.guard";
import { FetchWalletQuery } from "../queries/fetch-wallet.query";
import { User } from "@athena/types";
import { FetchWalletResponseDto } from "../dtos/fetch-wallet.output";

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {

  constructor(private readonly queryBus: QueryBus) {

  }

  @Get()
  @ApiOperation({ description: "Fetch user's wallet based on current session user" })
  @ApiOkResponse({ type: FetchWalletResponseDto })

  async fetchWallet(@CurrentUser() user: User) {
    await this.queryBus.execute<FetchWalletQuery>(
      new FetchWalletQuery(user.id)
    )

  }


}
