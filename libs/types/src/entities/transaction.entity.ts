
/**
 * Athena
 * Shared Type library
 * =======================================
 * Marketplace Transaction Models
 * =======================================
 *
 * Log:
 *  - 26 Oct 2025, Ananda Risyad
 */

import { UUID } from "crypto";
import { ID } from "../common/datatype.common";
import { TransactionStatus } from "../enums/transaction.enum";
export interface Transaction {
  /**
   * Represents a full purchase lifecycle for a note.
   * Created when a buyer initiates a purchase.
   * Linked to token escrow and resolved on completion or refund.
   */
  id: ID
  listingId: ID;
  buyerId: ID;
  sellerId: ID
  escrowId: ID
  status: TransactionStatus;
  /**
   * price amount at time of purchase
   */
  price: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  refundedAt?: string;
}


export type PublicTransaction = Omit<Transaction, "escrowId">
