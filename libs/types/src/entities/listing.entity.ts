/**
 * Athena
 * Shared Type library
 * ================================
 * Listing Model — Shared Type System
 * "Note" representation on the marketplace
 * ================================
 */

import { UUID } from "crypto";
import { Currency } from "../enums/currency.enum";
import { License } from "../enums/license.enum";
import { Visibility } from "../enums/visibility.enum";
import { ID } from "../common/datatype.common";

export interface Listing {
  id: ID;
  noteId: ID;
  sellerId: ID;
  title: string;
  summary: string;
  preview?: string;
  price: number;
  currency: Currency;
  license: License
  visibility: Visibility
  downloads: number;
  rating?: number;

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  archivedAt?: string;
  removedAt?: string
}

