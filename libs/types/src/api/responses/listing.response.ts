import { Listing } from "../../entities";
import { ApiResponse } from "../../utils/api-response";

export type CreatedListingResponse = ApiResponse<Listing>;

export type CreatedDraftListingResponse = ApiResponse<Partial<Listing>>;

export type UpdatedListingResponse = ApiResponse<Partial<Listing>>;

export type TakendownListingResponse = CreatedListingResponse;

export type FindOneListingResponse = ApiResponse<Listing>;

export type FindListingsResponse = ApiResponse<Listing[]>;
