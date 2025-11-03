import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserController } from "./user.controller";
import { UserProfileService } from "./services/user-profile.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserProfileService],
  controllers: [UserController],
  exports: [UserModule, TypeOrmModule]
})
export class UserModule { }
