import { UploadInstructionResponse } from "../..//utils/upload-response";
import { Note } from "../../entities";
import { ApiResponse } from "../../utils/api-response";
export type CreateNoteResponse = ApiResponse<Note>;
export type CreatePhotonoteResponse = ApiResponse<UploadInstructionResponse>;
