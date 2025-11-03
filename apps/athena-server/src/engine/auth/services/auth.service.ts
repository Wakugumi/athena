

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/core/user/user.entity';
import { Repository } from 'typeorm';
import { compareHash } from '../utils/auth.util';
import { PublicUser } from '@athena/types';
import { AthenaConfigService } from 'src/engine/athena-config/athena-config.service';
import { TokenAvoidlistService } from './token-avoidlist.service';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
    private readonly config: AthenaConfigService,
    private readonly avoidlistService: TokenAvoidlistService) { }

  async validateUser(username: string, pass: string): Promise<PublicUser | null> {
    const user = await this.userRepo.findOne({
      where: {
        username: username

      }
    })

    if (!user) {
      return null
    }

    if (await compareHash(pass, user?.passwordHash!)) {
      return user
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload),
      expires_in: this.config.get('JWT_EXPIRY')
    }
  }


  async logout(token: string) {
    this.avoidlistService.add(token)
  }

  /**
  * internal auth strategy use only, especially JWT guards
  */
  async findById(id: string): Promise<User | null> {
    return await this.userRepo.findOneBy({
      id: id
    })

  }
}
