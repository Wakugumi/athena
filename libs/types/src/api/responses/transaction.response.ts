import { Transaction } from "../../entities";
import { ApiResponse } from "../../utils/api-response";

export type CreatedTransactionResponse = ApiResponse<Transaction>

export type UpdatedTransactionResponse = ApiResponse<Transaction>

export type CancelTransactionResponse = ApiResponse<Transaction>

export type FindOneTransactionResponse = ApiResponse<Transaction>

export type FindTransactionsResponse = ApiResponse<Transaction[]>
