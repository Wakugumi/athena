import { NotificationCategory } from "@athena/types";
import { ApiProcessingResponse, ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";

export class NotificationRequestDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ enum: NotificationCategory })
  @IsEnum(NotificationCategory)
  category: NotificationCategory


  @ApiProperty({ required: false })
  message: string

}
