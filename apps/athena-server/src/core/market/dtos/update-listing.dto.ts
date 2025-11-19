import { Currency, License, UpdateListingRequest, Visibility } from "@athena/types";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateListingDto implements UpdateListingRequest {

  id: string;


  @IsString()
  @IsOptional()
  title?: string | null


  @IsEnum(Currency)
  currency?: Currency | null;

  @IsNumber()
  @IsOptional()
  price?: number | null;

  @IsEnum(License)
  license?: License | null;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsEnum(Visibility)
  @IsOptional()
  visibility?: Visibility | null;

  @IsString()
  @IsOptional()
  summary?: string | null;



}
