import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";
import { PASSWORD_REGEX } from "../utils/auth.util";
import { LoginRequest } from "@athena/types";

export class LoginPayload implements LoginRequest {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  password: string;
}
