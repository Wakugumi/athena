import { Listing } from "../../entities";
import { ApiResponse } from "../../utils/api-response";
import { UploadInstruction } from "../upload";

export type CreatedDraftListingResponse = ApiResponse<Partial<Listing>>;

export type UpdatedListingResponse = ApiResponse<Partial<Listing>>;

export type TakendownListingResponse = ApiResponse<Partial<Listing>>;

export type PublishedListingResponse = ApiResponse<Partial<Listing>>

export type FindOneListingResponse = ApiResponse<Listing>;
export type FindListingsResponse = ApiResponse<Listing[]>;


export type UploadFileListingResponse = ApiResponse<UploadInstruction>
