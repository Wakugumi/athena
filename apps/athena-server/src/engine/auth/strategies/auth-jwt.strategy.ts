

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AthenaConfigService } from 'src/engine/athena-config/athena-config.service';
import { AuthService } from '../services/auth.service';
import { PublicUser } from '@athena/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: AthenaConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET')
    });
  }

  async validate(payload: any) {
    const user = await this.authService.findById(payload.sub)
    if (!user) throw new UnauthorizedException();

    const { passwordHash, ...rest } = user

    return rest as PublicUser;
  }
}
