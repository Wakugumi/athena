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

export enum TokenTransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum TokenTransactionType {
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
export interface TokenBalance {
  userId: UUID
  tokenType: 'UTILITY';
  amount: number;
  updatedAt: string;
}

/**
 * Immutable ledger record of all token movements.
 * Use as the single source of truth for audits and reconciliation.
 * Never delete or modify existing rows — append new entries.
 *
 * Dev Notes:
 * This act as schema for database table
 */
export interface TokenTransaction {
  id: UUID;
  userId: UUID;
  type: TokenTransactionType;
  amount: number;
  balanceAfter: number;
  status: TokenTransactionStatus;
  idempotencyKey?: string; // used for retry-safe operations (e.g., payment webhooks)
  meta?: Record<string, any>;
  createdAt: string;
}


/**
 * Holds buyer tokens temporarily during a marketplace transaction.
 * Devs must ensure: tokens are deducted from buyer and locked until resolution.
 * Released to seller upon completion, refunded on cancellation.
 */
export interface MarketplaceEscrow {
  id: UUID;
  listingId: UUID;
  buyerId: UUID;
  sellerId: UUID;
  amount: number;
  status: 'HELD' | 'RELEASED' | 'REFUNDED' | 'CANCELLED';
  holdUntil?: string;
  createdAt: string;
  updatedAt: string;
}

