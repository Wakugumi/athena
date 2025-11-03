
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigVariables, validate } from './config-variables';
import { EnvironmentConfigDriver } from './drivers/environment-config.driver';
import { ConfigurableModuleClass } from './athena-config.module-definition';
import { CONFIG_VARIABLES_INSTANCE_TOKEN } from './constants/config-variable-instance.constant';
import { AthenaConfigService } from './athena-config.service';

@Global()
@Module({})
export class AthenaConfigModule extends ConfigurableModuleClass {
  static forRoot(): DynamicModule {
    const imports: Array<DynamicModule | Promise<DynamicModule>> = [
      ConfigModule.forRoot({
        isGlobal: true,
        expandVariables: true,
        validate: validate,
        envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      }),
    ];

    return {
      module: AthenaConfigModule,
      imports,
      providers: [
        AthenaConfigService,
        EnvironmentConfigDriver,
        {
          provide: CONFIG_VARIABLES_INSTANCE_TOKEN,
          useValue: new ConfigVariables(),
        },
      ],
      exports: [AthenaConfigService],
    };
  }
}

