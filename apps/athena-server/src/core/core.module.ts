import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { NoteModule } from "./note/note.module";
import { WalletModule } from "./wallet/wallet.module";
import { MarketModule } from "./market/market.module";
import { ListingModule } from "./listing/listing.module";

@Module({
  imports: [UserModule, NoteModule, WalletModule, MarketModule, ListingModule]
  ,
  exports: [CoreModule]
})
export class CoreModule {

}
