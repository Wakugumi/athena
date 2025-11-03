import { IsDefined, isDefined, IsOptional, IsUrl, validateSync, ValidationError } from "class-validator";
import { ConfigVariablesMetadata } from "./decorators/config-variables-metadata";
import { ConfigVariableType } from "./enums/config-variable-type.enum";
import { ConfigVariablesGroup } from "./enums/config-variables-group.enum";
import { NodeEnvironment } from "./enums/node-environment.enum";
import { Logger } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { CastToPositiveNumber } from "./decorators/cast-to-positive-number.decorator";
import { StorageDriverOptions } from "../storage/types/storage.types";

export class ConfigVariables {

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ServerConfig
    ,
    type: ConfigVariableType.ENUM,
    isEnvOnly: true
  })
  DATABASE_TYPE: 'postgres' | 'mysql' = 'postgres'


  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ServerConfig,
    description: 'Node environment (development, production, etc.)',
    type: ConfigVariableType.ENUM,
    options: Object.values(NodeEnvironment),
    isEnvOnly: true,
  })
  NODE_ENV: NodeEnvironment = NodeEnvironment.PRODUCTION;



  // DATABASE CONFIG

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ServerConfig,
    isSensitive: true,
    description: 'Database connection URL',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsDefined()
  @IsUrl({
    protocols: ['postgres', 'postgresql'],
    require_tld: false,
    allow_underscores: true,
    require_host: false,
  })
  DATABASE_URL: string;


  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ServerConfig,
    description: 'Database host url',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsOptional()
  DATABASE_HOST: string = 'localhost';


  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ServerConfig,
    description: 'Database port',
    type: ConfigVariableType.NUMBER,
    isEnvOnly: true,
  })
  @CastToPositiveNumber()
  @IsOptional()
  DATABASE_PORT: number = 5432;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ServerConfig,
    description: 'Database name',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsDefined()
  DATABASE_NAME: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ServerConfig,
    description: 'Database user',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsDefined()
  DATABASE_USER: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ServerConfig,
    isSensitive: true,
    description: 'Database password',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsDefined()
  DATABASE_PASSWORD: string = '';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ServerConfig,
    description:
      'Enable SSL connection to the database (required by some hosting providers)',
    isEnvOnly: true,
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  DATABASE_SSL = false;


  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ServerConfig,
    description:
      'Allow connections to a database with self-signed certificates',
    isEnvOnly: true,
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  DATABASE_SSL_ALLOW_SELF_SIGNED = false;


  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TokensDuration,

    description: 'JWT expirey duration in seconds',
    isEnvOnly: true,
    isSensitive: true,
    type: ConfigVariableType.NUMBER
  })
  JWT_EXPIRY: number = 60 * 60 * 24 * 7; // 7 days

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ServerConfig,
    description: "JWT Secret key",
    isEnvOnly: true,
    isSensitive: true,
    type: ConfigVariableType.STRING
  })
  JWT_SECRET: string;



  // Storage config
  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.StorageConfig,
    type: ConfigVariableType.ENUM,
    options: StorageDriverOptions
  })
  STORAGE_TYPE: StorageDriverOptions = StorageDriverOptions.LOCAL

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.StorageConfig,
    type: ConfigVariableType.STRING
  })
  STORAGE_PATH: string = "uploads"


  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.StorageConfig,
    type: ConfigVariableType.STRING
  })
  STORAGE_LOCAL_PATH: string = 'uploads'


  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.StorageConfig,
    type: ConfigVariableType.STRING
  })
  STORAGE_PUBLIC_BASE_URL: string = '/'


  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.StorageConfig,
    type: ConfigVariableType.STRING
  })
  STORAGE_AZURE_ACCOUNT_NAME: string;


  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.StorageConfig,
    type: ConfigVariableType.STRING
  })
  STORAGE_AZURE_ACCOUNT_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.StorageConfig,
    type: ConfigVariableType.STRING
  })
  STORAGE_AZURE_CONTAINER_NAME: string;


}

export const validate = (config: Record<string, unknown>): ConfigVariables => {
  const validatedConfig = plainToClass(ConfigVariables, config);

  const validationErrors = validateSync(validatedConfig, {
    strictGroups: true,
  });

  const validationWarnings = validateSync(validatedConfig, {
    groups: ['warning'],
  });
  const logValidatonErrors = (
    errorCollection: ValidationError[],
    type: 'error' | 'warn',
  ) =>
    errorCollection.forEach((error) => {
      if (!isDefined(error.constraints) || !isDefined(error.property)) {
        return;
      }
      Logger[type](Object.values(error.constraints).join('\n'));
    });

  if (validationWarnings.length > 0) {
    logValidatonErrors(validationWarnings, 'warn');
  }
  return validatedConfig;
};
