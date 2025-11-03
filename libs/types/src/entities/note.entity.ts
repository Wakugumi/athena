
/**
 * Athena
 * Shared Type library
 * ================================
 * Note Model — Shared Type System
 * ================================
 *
 * Log:
 * - 26 October 2025, Ananda Risyad
 */

import { ID } from "../common/datatype.common";


/**
 * Core Domain Entity
 */
export interface Note {
  id: ID;

  title: string;
  content: string;
  summary?: string | null
  embeddingVector?: number[] | null;   // For RAG / semantic search

  tags: string[];
  folderId?: ID | null;
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;

  // standard fields
  createdAt: string
  updatedAt: string
  deletedAt?: string

  // User/ownership
  ownerId: ID;
  collaborators?: Collaborator[];

  // AI metadata
  aiMetadata?: AIMetadata;
}


export enum CollaboratorRole {
  EDITOR = 'editor',
  VIEWER = 'viewer',
  COMMENTER = 'commenter'
}
/**
 * Supporting Types
 */
export interface Collaborator {
  userId: ID;
  role: CollaboratorRole
  invitedAt: string;
  accepted: boolean;
}


/**
 * Metadata for agent actions
 */
export interface AIMetadata {
  lastIndexedAt?: string;
  modelUsed?: string;
  tokens?: number;
  confidenceScore?: number;
}
// For returning lightweight previews (list view)
export interface NotePreview {
  id: ID;
  title: string;
  snippet: string;
  tags: string[];
  updatedAt: string;
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;
}


