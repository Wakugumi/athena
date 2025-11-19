import { ID } from "../common";
export declare enum TokenLedgerStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}
export declare enum TokenLedgerType {
    MINT = "MINT",
    BURN = "BURN",
    CREDIT = "CREDIT",
    DEBIT = "DEBIT"
}
export declare enum WalletOwnerType {
    USER = "USER",
    ESCROW = "ESCROW",
    SYSTEM = "SYSTEM",
    FEE = "FEE"
}
export interface Wallet {
    id: ID;
    ownerType: WalletOwnerType;
    ownerId: ID;
    balance: string;
    updatedAt: string;
}
export declare enum TokenLedgerReferenceType {
    REFUND = "REFUND",
    ORDER = "ORDER",
    FEE = "FEE"
}
export interface TokenLedger {
    id: ID;
    walletId: ID;
    type: TokenLedgerType;
    amount: number;
    balanceAfter: number;
    status: TokenLedgerStatus;
    referenceId?: ID | null;
    referenceType?: TokenLedgerReferenceType | null;
    meta?: Record<string, any>;
    createdAt: string;
}
export declare enum EscrowStatus {
    HELD = "HELD",
    RELEASED = "RELEASED",
    REFUNDED = "REFUNDED",
    CANCELLED = "CANCELLED"
}
export interface Escrow {
    id: ID;
    orderId: ID;
    amount: number;
    status: EscrowStatus;
    holdUntil?: string;
    createdAt: string;
    updatedAt: string;
}
