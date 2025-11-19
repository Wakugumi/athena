import { IsEmail, IsOptional, IsString, Matches } from "class-validator";
import { PASSWORD_REGEX, USERNAME_REGEX } from "../utils/auth.util";
import { ApiProperty } from "@nestjs/swagger";
import { SignupRequest } from "@athena/types";


export class SignupPayload implements SignupRequest {


  @ApiProperty()
  @IsString()
  @Matches(USERNAME_REGEX, {
    message: "Can only contains alphanumeric, underscore, and dots. Must start with a letter, cannot have consecutive dots or underscores, and must be 3-20 characters long"
  })
  username: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
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
  @Matches(PASSWORD_REGEX, {
    message: "Password must contains letters, numbers and at least one symbol"
  })
  password: string;
}



