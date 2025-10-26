import { UUID } from "crypto";

export enum Currency {
  TOKEN = "TOKEN",
  IDR = "IDR"
}

export enum License {
  PERSONAL = "personal",
  COMMERCIAL = 'commercial',
  OPEN = 'open'
}

export enum Visibility {
  PUBLIC = 'public',
  PRIVATE = 'private'
}

export interface MarketplaceNote {
  id: UUID;
  noteId: UUID;
  sellerId: UUID;
  title: string;
  summary: string;
  preview?: string;
  price: number;
  currency: Currency;
  license: License;
  visibility: Visibility;
  downloads: number;
  rating?: number;

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  archivedAt?: string;
}

/** DTOs */
export interface CreateMarketplaceNoteDTO {
  noteId: UUID;
  price: number;
  currency?: Currency
  license?: License
  visibility?: Visibility
}

export interface UpdateMarketplaceNoteDTO {
  price?: number;
  license?: License
  visibility?: Visibility
  archivedAt?: string;
}
