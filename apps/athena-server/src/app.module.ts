import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { CoreModule } from "./core/core.module";
import { EngineModule } from "./engine/engine.module";
import { CqrsModule } from "@nestjs/cqrs";
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
  imports: [
    EngineModule,
    CoreModule,
    DatabaseModule,
    CqrsModule.forRoot(),
    EventEmitterModule.forRoot()
  ],
  exports: [AppModule]

})
export class AppModule {

}
