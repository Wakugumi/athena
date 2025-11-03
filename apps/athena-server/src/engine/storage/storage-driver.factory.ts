import { resolveAbsolutePath } from 'src/utils/resolve-absolute-path.util';
import { LocalDriver } from './drivers/local.driver';
import { StorageDriver } from './types/storage-driver.interface';
import { StorageDriverOptions } from './types/storage.types';
import { AzureDriver } from './drivers/azure.driver';
import { Injectable } from '@nestjs/common';
import { AthenaConfigService } from '../athena-config/athena-config.service';
import { DynamicFactoryBase } from '../athena-config/dynamic-factory.base';
import { ConfigVariablesGroup } from '../athena-config/enums/config-variables-group.enum';
import { StorageException, StorageExceptionCode } from './types/storage.exception';

@Injectable()
export class StorageDriverFactory extends DynamicFactoryBase<StorageDriver> {
  constructor(configService: AthenaConfigService) {
    super(configService);
  }

  protected buildConfigKey(): string {


    const storageType = this.configService.get('STORAGE_TYPE');

    if (storageType == StorageDriverOptions.LOCAL) {
      const storagePath = this.configService.get('STORAGE_LOCAL_PATH');

      return `local|${storagePath}`;
    }

    if (storageType == StorageDriverOptions.AZURE) {
      const storageConfigHash = this.getConfigGroupHash(
        ConfigVariablesGroup.StorageConfig,
      );

      return `azure|${storageConfigHash}`;
    }

    throw new Error(`Unsuported storage type: ${storageType}`);
  }

  protected createDriver(): StorageDriver {
    const storageType = this.configService.get('STORAGE_TYPE');

    switch (storageType) {
      case StorageDriverOptions.LOCAL:
        const storagePath = this.configService.get('STORAGE_LOCAL_PATH');
        return new LocalDriver({
          storagePath: resolveAbsolutePath(storagePath),
        });

      case StorageDriverOptions.AZURE:
        const accountName = this.configService.get(
          'STORAGE_AZURE_ACCOUNT_NAME',
        );
        const accountKey = this.configService.get('STORAGE_AZURE_ACCOUNT_KEY');
        const containerName = this.configService.get(
          'STORAGE_AZURE_CONTAINER_NAME',
        );
        return new AzureDriver({
          accountName: accountName,
          accountKey: accountKey,
          container: containerName,
        });

      default:
        throw new StorageException("Storage type not supported", StorageExceptionCode.INVALID_CONFIGURATION)

    }
  }
}
