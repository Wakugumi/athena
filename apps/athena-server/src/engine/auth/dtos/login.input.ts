import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";
import { LoginRequest } from "@athena/types";
import { PASSWORD_REGEX } from "../utils/auth.util";

export class LoginDto implements LoginRequest {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @Matches(PASSWORD_REGEX)
  password: string;
}
