import { PublishListingRequest } from "@athena/types";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class PublishListingDto implements PublishListingRequest {
  @ApiProperty()
  @IsString()
  id: string;
}
