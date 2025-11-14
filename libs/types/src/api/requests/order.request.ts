import { ID } from "../../common/datatype.common"
import { OrderStatus } from "../../enums/order.enum";

export interface CreateOrderRequest {
  listingId: ID
  buyerId: ID
}

export interface UpdateOrderRequest {
  id: ID;
  status?: OrderStatus
}


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

