import { FindWalletLedgersQuery } from "@athena/types";
import { IsDate, IsOptional, IsString } from "class-validator";

export class FindWalletLedgersDTO implements FindWalletLedgersQuery {
  @IsString()
  walletId: string;

  @IsOptional()
  @IsDate()
  dateFrom?: string | null


  @IsOptional()
  @IsDate()
  dateTo?: string | null



}
