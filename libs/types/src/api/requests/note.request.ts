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
