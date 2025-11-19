

export interface AzureEventGridEvent<T = any> {
  id: string;
  eventType: string;
  /**
   * split by /blobs/<key>
  */
  subject: string;
  eventTime: string;
  data: T;
  dataVersion: string;
  metadataVersion: string;
}

export interface AzureBlobCreatedEvent {
  api: string;
  url: string;
  contentType?: string;
  contentLength?: number;
}
