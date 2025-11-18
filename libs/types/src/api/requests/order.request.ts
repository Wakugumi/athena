import { ID } from "../../common/datatype.common"
import { OrderStatus } from "../../enums/order.enum";

/**
 * Request called by a user who wants to purchase a listing
 */
export interface CreateOrderRequest {
  listingId: ID
  buyerId: ID
}

/**
 * Request called by a seller who wants to process their pending order
 */
export interface ProcessOrderRequest {
  id: ID;
}


/**
 * Request from buyer who will cancel their pending order
 */
export interface CancelOrderRequest {
  id: ID
}

export interface FindOneOrderQuery {
  id?: ID;
  /**
   * will return the latest one if there are multiple returned
   */
  listingId?: ID
}

export interface FindOrdersQuery {
  listingId?: ID;
  buyerId?: ID;
  sellerId?: ID;
  status?: OrderStatus;

  priceMin?: number;
  priceMax?: number;
  createdAtFrom?: string;
  createdAtTo?: string;
  completedAtFrom?: string;
  completedAtTo?: string;
  refundedAtFrom?: string;
  refundedAtTo?: string;
}

