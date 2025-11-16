import { PublicOrder, Order } from "../../entities";
import { ApiResponse } from "../../utils/api-response";

export type CreatedOrderResponse = ApiResponse<PublicOrder>

export type ProcessOrderResponse = ApiResponse<PublicOrder>

export type CancelOrderResponse = ApiResponse<PublicOrder>

export type FindOneOrderResponse = ApiResponse<PublicOrder>

export type FindOrdersResponse = ApiResponse<PublicOrder[]>
