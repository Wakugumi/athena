import { PublicTransaction, Transaction } from "../../entities";
import { ApiResponse } from "../../utils/api-response";

export type CreatedTransactionResponse = ApiResponse<PublicTransaction>

export type UpdatedTransactionResponse = ApiResponse<PublicTransaction>

export type CancelTransactionResponse = ApiResponse<PublicTransaction>

export type FindOneTransactionResponse = ApiResponse<PublicTransaction>

export type FindTransactionsResponse = ApiResponse<PublicTransaction[]>
