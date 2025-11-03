import { UpdateProfileRequest } from '@athena/types'
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateProfileDTO implements UpdateProfileRequest {

  @ApiProperty()
  @IsOptional()
  bio?: string;

  @ApiProperty()
  @IsOptional()
  displayName?: string

  @ApiProperty()
  @IsOptional()
  firstName?: string

  @ApiProperty()
  @IsOptional()
  lastName?: string
}
