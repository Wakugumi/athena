
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

export enum MarketplaceTransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export interface MarketplaceTransaction {
  /**
   * Represents a full purchase lifecycle for a note.
   * Created when a buyer initiates a purchase.
   * Linked to token escrow and resolved on completion or refund.
   */
  id: UUID;
  listingId: UUID;     // MarketplaceNote ID
  buyerId: UUID;
  sellerId: UUID;
  escrowId: UUID;
  status: MarketplaceTransactionStatus;
  price: number;       // token amount at time of purchase
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  refundedAt?: string;
}

/** DTOs */
export interface CreateMarketplaceTransactionDTO {
  listingId: UUID;
  buyerId: UUID;
}

export interface UpdateMarketplaceTransactionDTO {
  status?: MarketplaceTransactionStatus;
}
