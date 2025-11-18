import { CreateOrderRequest } from "@athena/types";

export class PurcaseInputDto implements CreateOrderRequest {

  buyerId: string;

  listingId: string;

}
