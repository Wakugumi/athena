
export type UploadInstructionResponse = {
  uploadId: string;

  // What the client must do to upload
  upload: {
    url: string;
    method: "PUT" | "POST";

    /**
     * Headers the client must include when uploading.
     * Example: { "Content-Type": "image/png" }
     */
    headers?: Record<string, string>;

    /**
     * If method === "POST" (e.g., S3 multipart form),
     * these form fields must be included.
     */
    formFields?: Record<string, string>;
  };

  /**
   * After uploading, the client may call this endpoint.
   * If the platform requires no completion call,
   * this object can be undefined.
   */
  complete?: {
    url: string;
    method: "POST" | "PUT";
  };

  /**
   * The final public CDN/accessible URL.
   * The client can use this in notes, attachments, display, etc.
   */
  finalUrl: string;
};
