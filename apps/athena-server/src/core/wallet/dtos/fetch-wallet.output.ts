import { ApiProperty } from "@nestjs/swagger";
import { Wallet } from "../entities/wallet.entity";

export class FetchWalletResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ required: false })
  message?: string;

  @ApiProperty({ required: false })
  error?: string;

  @ApiProperty({ type: Wallet, required: false })
  data?: Wallet;
}
