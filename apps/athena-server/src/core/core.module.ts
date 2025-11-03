import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { NoteModule } from "./note/note.module";

@Module({
  imports: [UserModule, NoteModule]
  ,
  exports: [CoreModule]
})
export class CoreModule {

}
