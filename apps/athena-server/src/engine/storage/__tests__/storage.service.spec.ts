import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from '../services/storage.service';
import { StorageDriverFactory } from '../storage-driver.factory';
import { ContentTypes } from '../types/storage.types';
import { STORAGE_OPTIONS } from '../types/storage.tokens';

describe('StorageService', () => {
  let service: StorageService;
  let factory: StorageDriverFactory;

  const mockStorageFactory = {
    getCurrentDriver: jest.fn(),
    buildConfigKey: jest.fn(),
    createDriver: jest.fn(),
    getConfigGroupHash: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: StorageDriverFactory,
          useValue: mockStorageFactory,
        },
        {
          provide: STORAGE_OPTIONS,
          useValue: {
            options: {
              publicBaseUrl: "/"
            }
          }
        }
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
    factory = module.get<StorageDriverFactory>(StorageDriverFactory);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('storage operations', () => {
    let mockDriver: any;

    beforeEach(async () => {
      mockDriver = {
        write: jest.fn(),
        delete: jest.fn(),
        read: jest.fn(),
        move: jest.fn(),
        copy: jest.fn(),
        download: jest.fn(),
        checkFileExists: jest.fn(),
        checkFolderExists: jest.fn(),
      };

      mockStorageFactory.getCurrentDriver.mockReturnValue(mockDriver);
    });

    describe('write operation', () => {
      it('should write a file', async () => {
        const params = {
          file: 'test',
          name: 'test',
          folder: 'test',
          mimeType: ContentTypes.JPEG,
        };

        mockDriver.write.mockResolvedValue(undefined);


        await service.write(params);

        expect(factory.getCurrentDriver).toHaveBeenCalled();
      });

      it('should return error', async () => {
        const params = {
          file: 'test',
          name: 'test',
          folder: 'test',
          mimeType: ContentTypes.JPEG,
        };

        const error = new Error('Write error');
        mockDriver.write.mockRejectedValue(error);

        await expect(service.write(params)).rejects.toThrow(error.message);

        expect(factory.getCurrentDriver).toHaveBeenCalled();
      });
    });
  });
});
