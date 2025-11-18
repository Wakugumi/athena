import { TokenLedgerReferenceType, TokenLedgerType, TokenLedger as ITokenLedger, TokenLedgerStatus } from '@athena/types'
import { Wallet } from 'src/core/wallet/entities/wallet.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity('token_ledger')
export class TokenLedger implements ITokenLedger {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'float', precision: 18, scale: 2 })
  amount: number;

  @Column()
  walletId: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.ledgerEntries)
  wallet: Relation<Wallet>

  @Column({ type: 'enum', enum: TokenLedgerType })
  type: TokenLedgerType;

  @CreateDateColumn()
  createdAt: string;


  @Column({ type: 'float', precision: 18, scale: 2 })
  balanceAfter: number;


  @Column({ nullable: true })
  referenceId?: string;

  @Column({ type: 'enum', enum: TokenLedgerReferenceType, nullable: true })
  referenceType?: TokenLedgerReferenceType;

  @Column({ type: 'jsonb' })
  meta?: Record<string, any> | undefined;


  status: TokenLedgerStatus;

}
