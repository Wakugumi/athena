export type UploadSource = string | Buffer | NodeJS.ReadableStream;

export enum ContentTypes {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  WEBP = 'image/webp',
}

export interface StoredFile {
  key: string; // remote key / relative path
  url?: string; // public URL (if available)
  etag?: string; // provider ETag/version
  metadata?: Record<string, string>;
}

export interface GetUrlOptions {
  expiresInSeconds?: number;
  contentType?: ContentTypes;
  key?: string;
  signed?: boolean;
}
export interface GetUploadUrlOptions {
  expiresInSeconds?: number;
  contentType: ContentTypes;
  key: string;
}

export interface UploadOptions {
  contentType?: ContentTypes;
  cacheControl?: string;
  acl?: 'private' | 'public-read'; // S3 style; strategies may adapt/ignore
  metadata?: Record<string, string>;
}

export enum StorageDriverOptions {
  LOCAL = 'LOCAL',
  AZURE = 'AZURE',
}

/** Per-driver option shapes */
export interface LocalOptions {
  root: string; // absolute or relative root dir for saved files
  publicBaseUrl?: string; // optional, e.g. https://cdn.example.com/files
}

export interface S3Options {
  bucket: string;
  region: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
  };
  forcePathStyle?: boolean; // for MinIO / custom endpoints
  endpoint?: string; // custom S3 endpoint
  publicBaseUrl?: string; // override URL building (e.g., CloudFront)
  defaultACL?: 'private' | 'public-read';
}

export interface AzureBlobOptions {
  accountName: string; // used to build public URL if desired
  container: string;
  sasToken?: string; // optional: if using SAS
  accountKey?: string;
  publicBaseUrl?: string; // override URL building (e.g., CDN)
}

export type DriverOptionsMap = {
  [StorageDriverOptions.LOCAL]: LocalOptions;
  [StorageDriverOptions.AZURE]: AzureBlobOptions;
};

export interface StorageModuleOptions<D = any> {
  driver: D;
  options: DriverOptionsMap[keyof DriverOptionsMap];
}

export interface StorageModuleAsyncOptions {
  useFactory: (
    ...args: any[]
  ) => Promise<StorageModuleOptions> | StorageModuleOptions;
  inject?: any[];
  imports?: any[];
}
