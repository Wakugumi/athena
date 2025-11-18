
/**
 * Athena
 * Shared Type library
 * =======================================
 * Marketplace Transaction Models
 * =======================================
 *
 * Log:
 *  - 26 Oct 2025, Ananda Risyad
 *  - 4 Nov 2025, Ananda Risyad : Change name to Order
 */

import { ID } from "../common/datatype.common";
import { OrderStatus } from "../enums/order.enum";
export interface Order {
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
  status: OrderStatus;
  /**
   * price amount at time of purchase
   */
  amount: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  refundedAt?: string | null
}


export type PublicOrder = Omit<Order, "escrowId">
