import { PublishListingRequest } from "@athena/types";
import { IsString } from "class-validator";

export class PublishListingDto implements PublishListingRequest {
  @IsString()
  id: string;
}
