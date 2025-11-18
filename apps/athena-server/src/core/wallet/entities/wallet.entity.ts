import { Wallet as TokenBalance, WalletOwnerType } from "@athena/types";
import { User } from "src/core/user/user.entity";
import { Column, Entity, ForeignKey, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { TokenLedger } from "./token-ledger.entity";

@Entity('wallet')

export class Wallet implements TokenBalance {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'enum', enum: WalletOwnerType })
  ownerType: WalletOwnerType;

  @Column()
  ownerId: string

  @Column()
  tokenType: "UTILITY";

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  balance: string; // avooid JS float rounding

  @OneToMany(() => TokenLedger, (transaction) => transaction.wallet)
  ledgerEntries: Relation<TokenLedger[]>

  @UpdateDateColumn()
  updatedAt: string;



}
