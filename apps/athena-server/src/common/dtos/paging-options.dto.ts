
import { PaginationQuery } from '@athena/types';
import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, IsString } from 'class-validator';

export class PagingOptionsDto implements PaginationQuery {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 10;

  @IsOptional()
  @IsString()
  sortBy?: string; // example: "createdAt"

  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC'; // example: "ASC"
}
