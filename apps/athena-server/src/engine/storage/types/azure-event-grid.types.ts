
export interface AzureEventGridEnvelope {
  id: string;
  eventType: string;
  eventTime: string;
  subject: string;
  dataVersion: string;
  metadataVersion: string;
  data: unknown;
}

export interface AzureBlobCreatedEvent {
  api: string;
  url: string;
  contentType?: string;
  contentLength?: number;
}
