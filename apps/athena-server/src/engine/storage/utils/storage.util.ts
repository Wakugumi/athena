import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { validateSync } from 'class-validator';
import {
  StorageModuleOptions,
  LocalOptions,
  S3Options,
  AzureBlobOptions,
  StorageDriverOptions,
} from '../types/storage.types';
import 'reflect-metadata';

class LocalOptionsDto implements LocalOptions {
  @IsString() root!: string;
  @IsOptional() @IsString() publicBaseUrl?: string;
}

class S3Creds {
  @IsString() accessKeyId!: string;
  @IsString() secretAccessKey!: string;
  @IsOptional() @IsString() sessionToken?: string;
}

class AzureOptionsDto implements AzureBlobOptions {
  @IsString() accountName!: string;
  @IsString() container!: string;
  @IsOptional() @IsString() connectionString?: string;
  @IsOptional() @IsString() sasToken?: string;
  @IsOptional() @IsString() publicBaseUrl?: string;
}

class StorageOptionsDto implements StorageModuleOptions {
  @IsEnum(StorageDriverOptions) driver!: StorageDriverOptions;

  // `options` shape depends on driver; validate loosely then deep-validate
  @IsObject() options!: any;
}

export function validateOptions(input: unknown): StorageModuleOptions {
  const base = plainToInstance(StorageOptionsDto, input);
  const baseErrors = validateSync(base, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  if (baseErrors.length) {
    throw new Error(
      `Invalid StorageModuleOptions: ${baseErrors[0].toString()}`,
    );
  }

  switch (base.driver) {
    case StorageDriverOptions.LOCAL: {
      const opts = plainToInstance(LocalOptionsDto, base.options);
      const errs = validateSync(opts, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      if (errs.length)
        throw new Error(`Invalid LocalOptions: ${errs[0].toString()}`);
      return { driver: base.driver, options: opts };
    }

    case StorageDriverOptions.AZURE: {
      const opts = plainToInstance(AzureOptionsDto, base.options);
      const errs = validateSync(opts, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      if (errs.length)
        throw new Error(`Invalid AzureBlobOptions: ${errs[0].toString()}`);
      return { driver: base.driver, options: opts };
    }
    default:
      // exhaustive check
      const _exhaustive: never = base.driver as never;
      throw new Error(`Unsupported driver: ${String(_exhaustive)}`);
  }
}
