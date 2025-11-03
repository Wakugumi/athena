import { DynamicModule, Global, Module } from '@nestjs/common';
import { StorageService } from './services/storage.service';
import { StorageTestController } from './controllers/test.controller';
import { StorageDriverFactory } from './storage-driver.factory';
import { STORAGE_OPTIONS, STORAGE_STRATEGY } from './types/storage.tokens';
import { AthenaConfigModule } from '../athena-config/athena-config.module';
import { AthenaConfigService } from '../athena-config/athena-config.service';
@Global()

export class StorageModule {
  static forRoot(): DynamicModule {
    return {
      module: StorageModule,
      imports: [AthenaConfigModule],
      providers: [
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
        StorageService,
      ],
      controllers: [StorageTestController],
      exports: [StorageService],
    };
  }
}
