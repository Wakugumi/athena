import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { AthenaConfigModule } from "./athena-config/athena-config.module";
import { StorageModule } from "./storage/storage.module";
import { NotificationModule } from "./notification/notification.module";

@Module({
  imports: [AuthModule, AthenaConfigModule.forRoot(), StorageModule.forRoot(), NotificationModule],
  exports: [EngineModule]
})
export class EngineModule { }
