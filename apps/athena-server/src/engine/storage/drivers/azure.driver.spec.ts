import { AzureDriver } from './azure.driver';
import { AzureBlobOptions } from '../types/storage.types';
import {
  StorageException,
  StorageExceptionCode,
} from '../types/storage.exception';
import {
  BlobServiceClient,
  ContainerClient,
  BlockBlobClient,
  BlobClient,
  StorageSharedKeyCredential,
  BlobDownloadResponseParsed,
} from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';
import { Readable } from 'stream';

// Mock Azure SDK
jest.mock('@azure/storage-blob');
jest.mock('@azure/identity');
jest.mock('fs/promises');
jest.mock('fs');
jest.mock('stream/promises');

const mockBlobServiceClient = BlobServiceClient as jest.MockedClass<
  typeof BlobServiceClient
>;
const mockContainerClient = {
  getBlockBlobClient: jest.fn(),
  getBlobClient: jest.fn(),
} as unknown as jest.Mocked<ContainerClient>;

const mockBlockBlobClient = {
  exists: jest.fn(),
  upload: jest.fn(),
  delete: jest.fn(),
  url: 'https://test.blob.core.windows.net/container/path/file.txt',
} as unknown as jest.Mocked<BlockBlobClient>;

const mockBlobClient = {
  deleteIfExists: jest.fn(),
  download: jest.fn(),
  exists: jest.fn(),
  beginCopyFromURL: jest.fn(),
  url: 'https://test.blob.core.windows.net/container/path/file.txt',
} as unknown as jest.Mocked<BlobClient>;

describe.only('AzureDriver', () => {
  let driver: AzureDriver;
  let options: AzureBlobOptions;
  let mockClient: jest.Mocked<BlobServiceClient>;

  beforeEach(() => {
    options = {
      accountName: 'testaccount',
      accountKey: 'testkey',
      container: 'testcontainer',
      publicBaseUrl: 'https://cdn.example.com',
    };

    jest.clearAllMocks();

    mockClient = {
      getContainerClient: jest.fn().mockReturnValue(mockContainerClient),
    } as unknown as jest.Mocked<BlobServiceClient>;

    mockBlobServiceClient.mockImplementation(() => mockClient);
    mockContainerClient.getBlockBlobClient.mockReturnValue(mockBlockBlobClient);
    mockContainerClient.getBlobClient.mockReturnValue(mockBlobClient);

    driver = new AzureDriver(options);
  });

  describe('constructor', () => {
    it('should initialize shared key credential when account key provided', () => {
      expect(StorageSharedKeyCredential).toHaveBeenCalledWith(
        'testaccount',
        'testkey',
      );
    });
  });

  describe('checkFileExists', () => {
    it('should return true when file exists', async () => {
      const params = { folderPath: 'folder', filename: 'file.txt' };
      mockBlockBlobClient.exists.mockResolvedValueOnce(true);

      const result = await driver.checkFileExists(params);

      expect(mockContainerClient.getBlockBlobClient).toHaveBeenCalledWith(
        'folder/file.txt',
      );
      expect(mockBlockBlobClient.exists).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false when file does not exist', async () => {
      const params = { folderPath: 'folder', filename: 'file.txt' };
      mockBlockBlobClient.exists.mockResolvedValueOnce(false);

      const result = await driver.checkFileExists(params);

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      const params = { folderPath: 'folder', filename: 'file.txt' };
      mockBlockBlobClient.exists.mockRejectedValueOnce(
        new Error('Azure error'),
      );

      const result = await driver.checkFileExists(params);

      expect(result).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete file successfully', async () => {
      const params = { folderPath: 'folder', filename: 'file.txt' };
      mockBlobClient.deleteIfExists.mockResolvedValueOnce({} as any);

      await driver.delete(params);

      expect(mockContainerClient.getBlobClient).toHaveBeenCalledWith(
        'folder/file.txt',
      );
      expect(mockBlobClient.deleteIfExists).toHaveBeenCalled();
    });

    it('should handle delete errors', async () => {
      const params = { folderPath: 'folder', filename: 'file.txt' };
      const error = new Error('Delete failed');
      mockBlobClient.deleteIfExists.mockRejectedValueOnce(error);

      await expect(driver.delete(params)).rejects.toThrow('Delete failed');
    });
  });

  describe('read', () => {
    it('should return readable stream', async () => {
      const params = { folderPath: 'folder', filename: 'file.txt' };
      const mockStream = new Readable();
      mockBlobClient.download.mockResolvedValueOnce({
        readableStreamBody: mockStream,
      } as any);

      const result = await driver.read(params);

      expect(mockContainerClient.getBlobClient).toHaveBeenCalledWith(
        'folder/file.txt',
      );
      expect(mockBlobClient.download).toHaveBeenCalled();
      expect(result).toBe(mockStream);
    });

    it('should throw StorageException when stream is undefined', async () => {
      const params = { folderPath: 'folder', filename: 'file.txt' };
      (mockContainerClient.getBlobClient as jest.Mock).mockReturnValue({
        download: jest
          .fn()
          .mockResolvedValue({ readableStreamBody: undefined }),
      });

      await expect(driver.read(params)).rejects.toThrow(StorageException);
      await expect(driver.read(params)).rejects.toThrow('Cannot read file');
    });

    it('should handle file not found error', async () => {
      const params = { folderPath: 'folder', filename: 'file.txt' };
      const error = new Error('File not found') as any;
      error.code = 'ENOENT';
      (mockContainerClient.getBlobClient as jest.Mock).mockReturnValue({
        download: jest.fn().mockRejectedValue(error),
      });

      await expect(driver.read(params)).rejects.toThrow(StorageException);
      await expect(driver.read(params)).rejects.toThrow('File not found');
    });

    it('should rethrow other errors', async () => {
      const params = { folderPath: 'folder', filename: 'file.txt' };
      const error = new Error('Azure error');

      (mockContainerClient.getBlobClient as jest.Mock).mockReturnValue({
        download: jest.fn().mockRejectedValueOnce(error),
      });

      await expect(driver.read(params)).rejects.toThrow('Azure error');
    });
  });

  describe('write', () => {
    it('should upload file successfully', async () => {
      const params = {
        file: Buffer.from('test content'),
        name: 'file.txt',
        folder: 'folder',
        mimeType: 'text/plain',
      };

      mockBlockBlobClient.upload.mockResolvedValueOnce({} as any);

      await driver.write(params);

      expect(mockContainerClient.getBlockBlobClient).toHaveBeenCalledWith(
        'folder/file.txt',
      );
      expect(mockBlockBlobClient.upload).toHaveBeenCalledWith(
        params.file,
        params.file.length,
      );
    });

    it('should handle upload errors', async () => {
      const params = {
        file: 'string content',
        name: 'file.txt',
        folder: 'folder',
        mimeType: undefined,
      };

      const error = new Error('Upload failed');
      mockBlockBlobClient.upload.mockRejectedValueOnce(error);

      await expect(driver.write(params)).rejects.toThrow('Upload failed');
    });
  });

  describe('move', () => {
    it('should move file successfully', async () => {
      const params = {
        from: { folderPath: 'folder1', filename: 'file.txt' },
        to: { folderPath: 'folder2', filename: 'newfile.txt' },
      };

      const copySpy = jest
        .spyOn(driver, 'copy')
        .mockResolvedValueOnce(undefined);
      mockBlockBlobClient.delete.mockResolvedValueOnce({} as any);

      await driver.move(params);

      expect(copySpy).toHaveBeenCalledWith(params);
      expect(mockBlockBlobClient.delete).toHaveBeenCalled();
    });

    it('should handle move errors', async () => {
      const params = {
        from: { folderPath: 'folder1', filename: 'file.txt' },
        to: { folderPath: 'folder2', filename: 'newfile.txt' },
      };

      jest
        .spyOn(driver, 'copy')
        .mockRejectedValueOnce(new Error('Copy failed'));

      await expect(driver.move(params)).rejects.toThrow('Copy failed');
    });
  });

  describe('copy', () => {
    it('should copy file successfully', async () => {
      const params = {
        from: { folderPath: 'folder1', filename: 'file.txt' },
        to: { folderPath: 'folder2', filename: 'newfile.txt' },
      };

      // Mock the from and to blob clients
      const fromBlobClient = {
        ...mockBlobClient,
        exists: jest.fn().mockResolvedValue(true),
      };
      const toBlobClient = {
        ...mockBlobClient,
        exists: jest.fn().mockResolvedValue(false),
        beginCopyFromURL: jest
          .fn()
          .mockResolvedValue({ pollUntilDone: jest.fn() }),
      };

      mockContainerClient.getBlockBlobClient
        .mockReturnValueOnce(fromBlobClient as any)
        .mockReturnValueOnce(toBlobClient as any);

      await driver.copy(params);

      expect(toBlobClient.exists).toHaveBeenCalled();
      expect(fromBlobClient.exists).toHaveBeenCalled();
      expect(toBlobClient.beginCopyFromURL).toHaveBeenCalledWith(
        fromBlobClient.url,
      );
    });

    it('should throw error when destination file already exists', async () => {
      const params = {
        from: { folderPath: 'folder1', filename: 'file.txt' },
        to: { folderPath: 'folder2', filename: 'newfile.txt' },
      };

      const toBlobClient = {
        ...mockBlobClient,
        exists: jest.fn().mockResolvedValue(true),
      };

      mockContainerClient.getBlockBlobClient
        .mockReturnValue(mockBlobClient as any)
        .mockReturnValue(toBlobClient as any);

      await expect(driver.copy(params)).rejects.toThrow(StorageException);
      await expect(driver.copy(params)).rejects.toThrow('File already exist');
    });

    it('should throw error when source file does not exist', async () => {
      const params = {
        from: { folderPath: 'folder1', filename: 'file.txt' },
        to: { folderPath: 'folder2', filename: 'newfile.txt' },
      };

      const fromBlobClient = {
        ...mockBlobClient,
        exists: jest.fn().mockResolvedValue(false),
      };
      const toBlobClient = {
        ...mockBlobClient,
        exists: jest.fn().mockResolvedValue(false),
      };

      mockContainerClient.getBlockBlobClient
        .mockReturnValue(fromBlobClient as any)
        .mockReturnValue(toBlobClient as any);

      await expect(driver.copy(params)).rejects.toThrow(StorageException);
      await expect(driver.copy(params)).rejects.toThrow('File not found');
    });
  });

  describe('download', () => {
    it('should throw error for downloading whole directory', async () => {
      const params = {
        from: { folderPath: 'folder1' },
        to: { folderPath: '/local/path' },
      };

      await expect(driver.download(params)).rejects.toThrow(
        'Downloading whole dir not supported yet',
      );
    });

    it('should throw error when copying folder to file', async () => {
      const params = {
        from: { folderPath: 'folder1' },
        to: { folderPath: '/local/path', filename: 'file.txt' },
      };

      await expect(driver.download(params)).rejects.toThrow(
        'Cannot copy folder to file',
      );
    });

    it('should download file successfully', async () => {
      const params = {
        from: { folderPath: 'folder1', filename: 'file.txt' },
        to: { folderPath: '/local/path', filename: 'localfile.txt' },
      };

      const mockStream = new Readable();
      jest.spyOn(driver, 'read').mockResolvedValueOnce(mockStream);

      // Mock fs operations
      const { mkdir } = require('fs/promises');
      const { pipeline } = require('stream/promises');
      const { createWriteStream } = require('fs');

      mkdir.mockResolvedValueOnce(undefined);
      pipeline.mockResolvedValueOnce(undefined);
      createWriteStream.mockReturnValueOnce({} as any);

      await driver.download(params);

      expect(mkdir).toHaveBeenCalledWith('/local/path', { recursive: true });
      expect(pipeline).toHaveBeenCalled();
    });

    it('should use source filename when destination filename not provided', async () => {
      const params = {
        from: { folderPath: 'folder1', filename: 'file.txt' },
        to: { folderPath: '/local/path' },
      };

      const mockStream = new Readable();
      jest.spyOn(driver, 'read').mockResolvedValueOnce(mockStream);

      const { mkdir } = require('fs/promises');
      const { pipeline } = require('stream/promises');
      const { createWriteStream } = require('fs');

      mkdir.mockResolvedValueOnce(undefined);
      pipeline.mockResolvedValueOnce(undefined);
      createWriteStream.mockReturnValueOnce({} as any);

      await driver.download(params);

      expect(createWriteStream).toHaveBeenCalledWith('/local/path/file.txt');
    });
  });

  describe('getSignedUrl', () => {
    it('should generate signed URL successfully', async () => {
      const params = {
        folderPath: 'folder',
        filename: 'file.txt',
        expiresInSeconds: 3600,
      };

      // Mock the generateBlobSASQueryParameters function
      const { generateBlobSASQueryParameters } = require('@azure/storage-blob');
      generateBlobSASQueryParameters.mockReturnValue({
        toString: () => 'sastoken=abc123',
      });

      const result = await driver.getSignedUrl(params);

      expect(result).toBe(
        'https://test.blob.core.windows.net/container/path/file.txt?sastoken=abc123',
      );
    });

    it('should handle SAS generation errors', async () => {
      const params = {
        folderPath: 'folder',
        filename: 'file.txt',
      };

      const { generateBlobSASQueryParameters } = require('@azure/storage-blob');
      generateBlobSASQueryParameters.mockImplementation(() => {
        throw new Error('SAS generation failed');
      });

      await expect(driver.getSignedUrl(params)).rejects.toThrow(
        StorageException,
      );
      await expect(driver.getSignedUrl(params)).rejects.toThrow(
        'Failed to generate signed URL',
      );
    });

    it('should use default expiration when not provided', async () => {
      const params = {
        folderPath: 'folder',
        filename: 'file.txt',
      };

      const { generateBlobSASQueryParameters } = require('@azure/storage-blob');
      generateBlobSASQueryParameters.mockReturnValue({
        toString: () => 'sastoken=abc123',
      });

      await driver.getSignedUrl(params);

      expect(generateBlobSASQueryParameters).toHaveBeenCalledWith(
        expect.objectContaining({
          expiresOn: expect.any(Date),
        }),
        expect.any(StorageSharedKeyCredential),
      );
    });
  });
});
