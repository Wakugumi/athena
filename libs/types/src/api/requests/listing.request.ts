import { Listing } from "../../entities";
import { ID } from "../../common/datatype.common";
import { ContentTypes, Visibility, License, Currency } from "../../enums";

export type DraftListingRequest = Partial<Listing>;


export interface UpdateListingRequest {
  id: string;
  title?: string | null;
  currency?: Currency | null;
  price?: number | null;
  license?: License | null;
  description?: string | null;
  summary?: string | null;

};

export interface TakedownListingRequest {
  id: ID;
}

export interface PublishListingRequest {
  id: ID;
}

export interface UploadFileDraftListingRequest {
  contentType: ContentTypes,
  /**
   * Optional.
   * Use case: Direct upload file button as new draft or upload to a existing draft
   */
  listingId?: string | null

}



