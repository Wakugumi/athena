import { Wallet as TokenBalance, WalletOwnerType } from "@athena/types";
import { TokenLedger } from "src/core/ledger/entities/token-ledger.entity";
import { User } from "src/core/user/user.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";

@Entity('wallet')

export class Wallet implements TokenBalance {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'enum', enum: WalletOwnerType, enumName: "walle_owner_type" })
  ownerType: WalletOwnerType;

  @Column()
  ownerId: string

  @OneToOne(() => User, (user) => user.wallet)
  owner: Relation<User>


  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  balance: string; // avooid JS float rounding

  @OneToMany(() => TokenLedger, (transaction) => transaction.wallet)
  ledgerEntries: Relation<TokenLedger[]>

  @UpdateDateColumn()
  updatedAt: string;



}

console.log("TEST", WalletOwnerType)
