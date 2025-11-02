import { ID } from "../../common/datatype.common";
import { Currency } from "../../enums/currency.enum";
import { License } from "../../enums/license.enum";

export interface CreateListingRequest {

  /**
   * Identification data for the note to be listed
   */
  noteId: ID

  /**
   * Identification data for the seller
  */
  sellerId: ID

  /**
   * Title for the listing page
  */
  title: string;

  /**
   * Currency of the price tag
  */
  currency: Currency;

  /**
   * Amount of price for acquiring the listing
  */
  price: number;

  /**
   * License associated with the product
  */
  license: License;

}

export interface UpdateListingRequest {
  noteId?: ID;
  title?: string;
  currency?: Currency;
  price?: number;
  license?: License
}

export interface TakedownListingRequest {
  id: ID;
}


/**
 * queries for finding listings
  * can be used for general and advance search
  */
export interface FindListingsQuery {
  title?: string;
  price?: string;
  /**
  * seller's display name
  */
  seller?: string
  currecy?: Currency
  sellerId?: ID
  noteId?: ID;
}


/**
 *
 * Query for get data of a listing
 */
export interface FindOneListingQuery {
  id?: ID;
}
