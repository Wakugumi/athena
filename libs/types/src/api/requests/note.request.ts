import { ContentTypes } from "src/enums";
import { ID } from "../../common";

export interface CreateNoteRequest {
  title?: string;
  tags?: string[];
  folderId?: ID;
  isPinned?: boolean;
}

export interface FindNotesQuery {
  search?: string;
  tag?: string;
  folderId?: ID;
  includeArchived?: boolean;
  includeTrashed?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';

}

/**
 * Interface for requesting url for image upload that will be transformed into new note
  */
export interface CreatePhotonoteRequest {
  contentType: ContentTypes



}
