import { Currency, License, UpdateListingRequest, Visibility } from "@athena/types";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateDraftListingDto implements UpdateListingRequest {

  @ApiProperty({ description: "Listing's id", required: true })
  @IsString()
  id: string;


  @ApiProperty({ nullable: true, type: "string", required: false })
  @IsString()
  @IsOptional()
  title?: string | null


  @ApiProperty({ nullable: true, type: "string", required: false })
  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency | null;

  @ApiProperty({ nullable: true, type: "number", required: false })
  @IsNumber()
  @IsOptional()
  price?: number | null;

  @ApiProperty({ nullable: true, type: "string", required: false })
  @IsEnum(License)
  @IsOptional()
  license?: License | null;

  @ApiProperty({ nullable: true, type: "string", required: false })
  @IsString()
  @IsOptional()
  description?: string | null;

  @ApiProperty({ nullable: true, type: "string", required: false })
  @IsString()
  @IsOptional()
  summary?: string | null;



}
