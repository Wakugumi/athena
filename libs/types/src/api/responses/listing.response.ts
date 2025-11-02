import { Listing } from "../../entities";
import { ApiResponse } from "../../utils/api-response";

export type CreatedListingResponse = ApiResponse<Listing>;

export type UpdatedListingResponse = Partial<CreatedListingResponse>;

export type TakendownListingResponse = CreatedListingResponse;

export type FindOneListingResponse = ApiResponse<Listing>;

export type FindListingsResponse = ApiResponse<Listing[]>;
