import { Wallet, TokenLedger } from "../../entities";
import { ApiResponse } from "../../utils/api-response";

export type GetWalletBalanceResponse = ApiResponse<Wallet>;


export type FindWalletLedgersResponse = ApiResponse<TokenLedger[]>;
