import { ContentTypes, UploadFileDraftListingRequest } from "@athena/types";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class UploadFileDraftListingDTO implements UploadFileDraftListingRequest {
  @ApiProperty({ enumName: "content_types", enum: ContentTypes })
  @IsEnum(ContentTypes)
  contentType: ContentTypes;


  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  listingId?: string | null
}
