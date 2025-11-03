

import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenAvoidlistService } from '../services/token-avoidlist.service';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly avoidlistService: TokenAvoidlistService) {
    super();
  }


  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers["authorization"]

    /** TODO: implement Avoid List Service
    if (auth && auth.startsWith("Bearer ")) {
      const token = auth.slice(7);
      if (this.avoidlistService.has(token)) throw new UnauthorizedException("Token has been revoked")
    }
    */

    if (err || !user) {
      const message = info?.message || info?.name || (err?.message ?? "Token validation failed")

      throw new UnauthorizedException(message)
    }
    return user;
  }
}
