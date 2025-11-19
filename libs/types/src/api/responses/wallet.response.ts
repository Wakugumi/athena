import { Wallet, TokenLedger } from "../../entities";
import { ApiResponse } from "../../utils/api-response";

export type FetchWalletResponse = ApiResponse<Wallet>;


export type FindWalletLedgersResponse = ApiResponse<TokenLedger[]>;

