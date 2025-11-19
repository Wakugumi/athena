import { ID } from "../common/datatype.common";
import { OrderStatus } from "../enums/order.enum";
export interface Order {
    id: ID;
    listingId: ID;
    buyerId: ID;
    sellerId: ID;
    escrowId: ID;
    status: OrderStatus;
    amount: number;
    createdAt: string;
    updatedAt: string;
    completedAt?: string | null;
    refundedAt?: string | null;
}
export type PublicOrder = Omit<Order, "escrowId">;
