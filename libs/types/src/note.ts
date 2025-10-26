
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

export type UUID = string;

/**
 * Core Domain Entity
 */
export interface Note {
  id: UUID;

  title: string;
  content: string;
  summary?: string;
  embeddingVector?: number[];   // For RAG / semantic search

  tags: string[];
  folderId?: UUID;
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;

  // standard fields
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  // User/ownership
  ownerId: UUID;
  collaborators?: Collaborator[];

  // AI metadata
  aiMetadata?: AIMetadata;
}

/**
 * Supporting Types
 */
export interface Collaborator {
  userId: UUID;
  role: 'editor' | 'viewer' | 'commenter';
  invitedAt: string;
  accepted: boolean;
}

export interface AIMetadata {
  lastIndexedAt?: string;
  modelUsed?: string;
  tokens?: number;
  confidenceScore?: number;
}

/**
 * DTOs — Transport & Payload Types
 */

// Create new note
export interface CreateNoteDTO {
  title?: string;
  content?: string;
  tags?: string[];
  folderId?: UUID;
  isPinned?: boolean;
}

// Update existing note
export interface UpdateNoteDTO {
  title?: string;
  content?: string;
  tags?: string[];
  folderId?: UUID;
  isPinned?: boolean;
  isArchived?: boolean;
  isTrashed?: boolean;
}

// For querying / finding notes
export interface FindNotesQuery {
  search?: string;
  tag?: string;
  folderId?: UUID;
  includeArchived?: boolean;
  includeTrashed?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// For returning lightweight previews (list view)
export interface NotePreview {
  id: UUID;
  title: string;
  snippet: string;
  tags: string[];
  updatedAt: string;
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;
}

/**
 * API Response Types
 */
export interface NoteResponse {
  note: Note;
}

export interface NotesResponse {
  notes: NotePreview[];
  total: number;
}

/**
 * Event Payloads
 */
export interface NoteCreatedEvent {
  note: Note;
}

export interface NoteUpdatedEvent {
  noteId: UUID;
  changes: Partial<Note>;
}

export interface NoteDeletedEvent {
  noteId: UUID;
  hardDelete?: boolean;
}
