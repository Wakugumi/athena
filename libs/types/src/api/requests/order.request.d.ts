import { ID } from "../../common/datatype.common";
import { OrderStatus } from "../../enums/order.enum";
export interface CreateOrderRequest {
    listingId: ID;
    buyerId: ID;
}
export interface ProcessOrderRequest {
    id: ID;
}
export interface CancelOrderRequest {
    id: ID;
}
export interface FindOneOrderQuery {
    id?: ID;
    listingId?: ID;
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
