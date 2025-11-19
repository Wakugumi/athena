import { ID } from "../common/datatype.common";
export interface Note {
    id: ID;
    title: string;
    content: string;
    attachments?: NoteAttachment[] | null;
    summary?: string | null;
    embeddingVector?: number[] | null;
    tags: string[];
    folderId?: ID | null;
    isPinned: boolean;
    isArchived: boolean;
    isTrashed: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    ownerId: ID;
    collaborators?: Collaborator[];
    aiMetadata?: AIMetadata;
}
export interface NoteAttachment {
    id: ID;
    key: string;
    url: string;
    originalFilename: string;
    contentType: string;
    size: number;
    createdAt: string;
}
export declare enum CollaboratorRole {
    EDITOR = "editor",
    VIEWER = "viewer",
    COMMENTER = "commenter"
}
export interface Collaborator {
    userId: ID;
    role: CollaboratorRole;
    invitedAt: string;
    accepted: boolean;
}
export interface AIMetadata {
    lastIndexedAt?: string;
    modelUsed?: string;
    tokens?: number;
    confidenceScore?: number;
}
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
