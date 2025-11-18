import { ProcessOrderRequest } from "@athena/types";

export class ProcessOrderDto implements ProcessOrderRequest {
  /**
   * id of the order
  */
  id: string;
}
