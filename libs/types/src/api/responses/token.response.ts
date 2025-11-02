import { TokenBalance, TokenTransaction } from "../../entities";
import { ApiResponse } from "../../utils/api-response";

export type GetTokenBalanceResponse = ApiResponse<TokenBalance>;


export type GetTokenTransactionsResponse = ApiResponse<TokenTransaction[]>;
