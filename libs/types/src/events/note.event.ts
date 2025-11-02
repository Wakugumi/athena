import { UUID } from "crypto";
import { Note } from "../entities";
import { ID } from "../common";

/**
 * Event Payloads
 */
export interface NoteCreatedEvent {
  note: Note;
}

export interface NoteUpdatedEvent {
  noteId: ID;
  changes: Partial<Note>;
}

export interface NoteDeletedEvent {
  noteId: ID
  hardDelete?: boolean;
}
