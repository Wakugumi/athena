import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserController } from "./user.controller";
import { UserProfileService } from "./services/user-profile.service";
import { StorageModule } from "src/engine/storage/storage.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), StorageModule],
  providers: [UserProfileService],
  controllers: [UserController],
  exports: [UserModule, TypeOrmModule]
})
export class UserModule { }
