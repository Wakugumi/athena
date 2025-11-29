import { DynamicModule, Global, Module } from '@nestjs/common';
import { StorageService } from './services/storage.service';
import { StorageTestController } from './controllers/test.controller';
import { StorageDriverFactory } from './storage-driver.factory';
import { STORAGE_OPTIONS, STORAGE_STRATEGY, UPLOAD_CALLBACK_URL } from './types/storage.tokens';
import { AthenaConfigModule } from '../athena-config/athena-config.module';
import { AthenaConfigService } from '../athena-config/athena-config.service';
import { StorageKeyService } from './services/storage-key.service';
import { StorageProcessingService } from './services/storage-processing.service';
import { NoteModule } from 'src/core/note/note.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadEntity } from './entities/upload.entity';
import { UploadService } from './services/upload.service';
import { UploadController } from './controllers/upload.controller';

@Global()
@Module({})
export class StorageModule {
  static forRoot(): DynamicModule {
    return {
      module: StorageModule,
      imports: [AthenaConfigModule, NoteModule, TypeOrmModule.forFeature([UploadEntity])],
      providers: [
        StorageKeyService,
        StorageDriverFactory,
        // provide STORAGE_OPTIONS token so StorageService can inject configuration
        {
          provide: STORAGE_OPTIONS,
          useFactory: (config: AthenaConfigService) => {
            // shape expected by StorageService is any; include commonly used options
            return {
              options: {
                publicBaseUrl: config.get('STORAGE_PUBLIC_BASE_URL'),
              },
            };
          },
          inject: [AthenaConfigService],
        },
        // provide STORAGE_STRATEGY if consumers need bit
        {
          provide: STORAGE_STRATEGY,
          useFactory: (config: AthenaConfigService) =>
            config.get('STORAGE_TYPE'),
          inject: [AthenaConfigService],
        },
        {
          provide: UPLOAD_CALLBACK_URL,
          useFactory: (config: AthenaConfigService) =>
            config.get('API_URL')
          ,
          inject: [AthenaConfigService]
        },
        StorageService,
        StorageProcessingService,
        UploadService
      ],
      controllers: [StorageTestController, UploadController],
      exports: [StorageService, StorageKeyService, StorageProcessingService, UploadService],
    };
  }
}
