import { IsEmail, IsString, Matches } from "class-validator";
import { PASSWORD_REGEX, USERNAME_REGEX } from "../utils/auth.util";
import { ApiProperty } from "@nestjs/swagger";
import { SignupRequest } from "@athena/types";


export class SignupPayload implements SignupRequest {


  @ApiProperty()
  @IsString()
  @Matches(USERNAME_REGEX)
  username: string;

  @ApiProperty()
  @IsString()
  displayName?: string | null;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  bio: string;


  @ApiProperty()
  @Matches(PASSWORD_REGEX)
  password: string;
}



