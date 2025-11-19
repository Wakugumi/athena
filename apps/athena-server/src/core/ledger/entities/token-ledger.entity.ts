import { TokenLedgerReferenceType, TokenLedgerType, TokenLedger as ITokenLedger, TokenLedgerStatus } from '@athena/types'
import { Wallet } from 'src/core/wallet/entities/wallet.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity('token_ledger')
export class TokenLedger implements ITokenLedger {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  amount: number;

  @Column()
  walletId: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.ledgerEntries)
  wallet: Relation<Wallet>

  @Column({ type: 'enum', enum: TokenLedgerType, enumName: "token_ledger_type" })
  type: TokenLedgerType;

  @CreateDateColumn()
  createdAt: string;


  @Column({ type: 'numeric', precision: 18, scale: 2 })
  balanceAfter: number;


  @Column({ nullable: true })
  referenceId?: string;

  @Column({ type: 'enum', enum: TokenLedgerReferenceType, enumName: "token_ledger_ref_type", nullable: true })
  referenceType?: TokenLedgerReferenceType | null;

  @Column({ type: 'jsonb' })
  meta?: Record<string, any> | undefined;


  status: TokenLedgerStatus;
  constructor() {

    console.log("TEST", TokenLedgerType)
  }

}
