import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from 'passport-local';
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../services/auth.service";
import { User } from "src/core/user/user.entity";
import { AuthException } from "../auth.exception";
import { PublicUser } from "@athena/types";

@Injectable()
export class AuthLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
  async validate(username: string, password: string): Promise<PublicUser> {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException()
    }

    return user;

  }
}
