import { Currency } from "../enums/currency.enum";
import { License } from "../enums/license.enum";
import { Visibility } from "../enums/visibility.enum";
import { ID } from "../common/datatype.common";
import { ListingStatus } from "../enums/listing-status.enum";
export interface ListingItem {
    id: string;
    blobKey: string;
    title: string;
    listingId: ID;
    createdAt: string;
    deletedAt?: string;
}
export interface Listing {
    id: ID;
    items: ListingItem[];
    sellerId: ID;
    title: string;
    description?: string | null;
    summary: string;
    preview?: string;
    price: number;
    currency: Currency;
    license: License;
    visibility: Visibility;
    status: ListingStatus;
    downloads: number;
    rating?: number;
    itemsExpectedCount: number;
    itemsProcessedCount: number;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string | null;
    archivedAt?: string | null;
    removedAt?: string | null;
}
