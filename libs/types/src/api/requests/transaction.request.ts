import { ID } from "../../common/datatype.common"
import { TransactionStatus } from "../../enums/transaction.enum";

export interface CreateTransactionRequest {
  listingId: ID
  buyerId: ID
}

export interface UpdateTransactionRequest {
  id: ID;
  status?: TransactionStatus
}


export interface CancelTransactionRequest {
  id: ID
}

export interface FindOneTransactionQuery {
  id?: ID;
  /**
   * will return the latest one if there are multiple returned
   */
  listingId?: ID
}

export interface FindTransactionsQuery {
  listingId?: ID;
  buyerId?: ID;
  sellerId?: ID;
  status?: TransactionStatus;

  priceMin?: number;
  priceMax?: number;
  createdAtFrom?: string;
  createdAtTo?: string;
  completedAtFrom?: string;
  completedAtTo?: string;
  refundedAtFrom?: string;
  refundedAtTo?: string;
}

