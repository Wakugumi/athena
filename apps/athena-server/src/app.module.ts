import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { CoreModule } from "./core/core.module";
import { EngineModule } from "./engine/engine.module";

@Module({
  imports: [
    EngineModule,
    CoreModule,
    DatabaseModule,
  ],
  exports: [AppModule]

})
export class AppModule {

}
