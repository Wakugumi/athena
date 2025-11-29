export interface UploadCallback {
  url: string;
  method?: "POST" | "GET";
  headers?: Record<string, string>;
  note?: string

}
export interface UploadInstruction {
  url?: string;
  method?: "POST" | "PATCH" | "PUT";
  /**
  * Optional.
  * Headers required for uploading to storage providers
  */
  headers?: Record<string, string>;
  /**
  * Required if given.
  * API endpoint for upload progress callback
  */
  callback?: UploadCallback
}
