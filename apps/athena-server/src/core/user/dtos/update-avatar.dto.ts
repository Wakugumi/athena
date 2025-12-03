import { ContentTypes, UpdateAvatarRequest } from "@athena/types";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export class UpdateAvatarRequestDto implements UpdateAvatarRequest {

  @ApiProperty({ enum: ContentTypes })
  @IsEnum(ContentTypes)
  contentType: ContentTypes;

}
