import { Module } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { AuthLocalStrategy } from "./strategies/auth-local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { AthenaConfigModule } from "../athena-config/athena-config.module";
import { AthenaConfigService } from "../athena-config/athena-config.service";
import { JwtStrategy } from "./strategies/auth-jwt.strategy";
import { AuthController } from "./auth.controller";
import { SignupService } from "./services/signup.service";
import { TokenAvoidlistService } from "./services/token-avoidlist.service";
import { JwtAuthGuard } from "./guards/auth-jwt.guard";
import { LocalAuthGuard } from "./guards/auth-local.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/core/user/user.entity";
import { UserModule } from "src/core/user/user.module";
import { UserProfileService } from "src/core/user/services/user-profile.service";

@Module({
  controllers: [AuthController],
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.registerAsync({
    imports: [AthenaConfigModule],
    useFactory: (config: AthenaConfigService) => ({
      secret: config.get("JWT_SECRET"),
      global: true,
      signOptions: {
        expiresIn: config.get('JWT_EXPIRY')
      }

    })
    ,
    inject: [AthenaConfigService]
  }), UserModule],
  providers: [UserProfileService, SignupService, AuthService, AuthLocalStrategy, JwtStrategy, TokenAvoidlistService, JwtAuthGuard, LocalAuthGuard]
  ,
  exports: [AuthModule]


})
export class AuthModule { }
