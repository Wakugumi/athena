/**
 * Athena
 * Shared Type library
 * ================================
 * Token Model — Shared Type System
 * Token representation for transaction ledger.
 * Update ledger per single DB transaction;
 *
 * Note: This type is mainly for backend purpose, not intended for public facing apps
 * ================================
 *
 * Log:
 * - 26 October 2025, Ananda Risyad
 */



import { UUID } from "crypto";
import { CANCELLED } from "dns";
import { ID } from "src/common";

export enum TokenLedgerStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum TokenLedgerType {
  /**
   * system to user token transaction
   */
  MINT = 'MINT',

  /**
   * user to system token transaction
   */
  BURN = 'BURN',

  /**
   * seller receive tokens after escrow release
   */
  CREDIT = 'CREDIT',

  /**
   * tokens deducted from buyer
   */
  DEBIT = 'DEBIT'
}

/**
   * Represents the current token balance for a user.
   * Always update through transactional operations to prevent race conditions.
   */
export interface Wallet {
  id: ID
  userId: ID
  tokenType: 'UTILITY';
  balance: string; // avoid JS float rounding
  updatedAt: string;
}

export enum TokenLedgerReferenceType {
  REFUND = 'REFUND',
  ORDER = 'ORDER',
  FEE = "FEE"
}
/**
 * Immutable ledger record of all token movements.
 * Use as the single source of truth for audits and reconciliation.
 * Never delete or modify existing rows — append new entries.
 *
 * Dev Notes:
 * This act as schema for database table
 */
export interface TokenLedger {
  id: ID;
  walletId: ID;
  type: TokenLedgerType;
  amount: number;
  balanceAfter: number;
  status: TokenLedgerStatus;
  /**
   * Polymorphic reference
   * e.g. if its an ORDER, the reference to the originating Order
   */
  referenceId?: ID | null;
  referenceType?: TokenLedgerReferenceType | null;
  meta?: Record<string, any>;
  createdAt: string;
}


export enum EscrowStatus {
  HELD = "HELD",
  RELEASED = "RELEASED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED"
}
/**
 * Holds buyer tokens temporarily during a marketplace transaction.
 * Devs must ensure: tokens are deducted from buyer and locked until resolution.
 * Released to seller upon completion, refunded on cancellation.
 */
export interface Escrow {
  id: ID;
  orderId: ID;
  amount: number;
  status: EscrowStatus
  holdUntil?: string;
  createdAt: string;
  updatedAt: string;
}

