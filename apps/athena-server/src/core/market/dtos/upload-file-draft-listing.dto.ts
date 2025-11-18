import { ContentTypes, UploadFileDraftListingRequest } from "@athena/types";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class UploadFileDraftListingDTO implements UploadFileDraftListingRequest {
  @IsEnum(ContentTypes)
  contentType: ContentTypes;

  @IsNumber()
  size: number;

  @IsString()
  @IsOptional()
  listingId?: string | null
}
