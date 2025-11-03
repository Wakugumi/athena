import { ConfigVariablesGroup } from './enums/config-variables-group.enum';
import { ConfigVariables } from './config-variables';
import { TypedReflect } from 'src/utils/typed-reflect';
import { createHash } from 'node:crypto';
import { AthenaConfigService } from './athena-config.service';

export abstract class DynamicFactoryBase<TDriver> {
  private currentDriver: TDriver | null = null;
  private currentConfigKey: string | null = null;
  constructor(protected readonly configService: AthenaConfigService) { }

  getCurrentDriver(): TDriver {
    let configKey: string;

    try {
      configKey = this.buildConfigKey();
    } catch (error) {
      throw new Error(
        `Failed to build config key for ${this.constructor.name}. Original Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    if (this.currentConfigKey !== configKey) {
      try {
        this.currentDriver = this.createDriver();
      } catch (error) {
        throw new Error(
          `Failed to create driver for ${this.constructor.name}. Error: ${error instanceof Error ? error.message : String(error)}`,
        );
      }

      this.currentConfigKey = configKey;
    }

    if (!this.currentDriver) {
      throw new Error(
        `Failed to create driver for ${this.constructor.name} with config key: ${configKey}`,
      );
    }

    return this.currentDriver;
  }

  protected getConfigGroupHash(group: ConfigVariablesGroup): string {
    const groupVars = this.getConfigVariablesGroup(group);

    const configValues = groupVars
      .map((key) => `${key}=${this.configService.get(key)}`)
      .sort()
      .join('|');

    return createHash('sha256')
      .update(configValues)
      .digest('hex')
      .substring(0, 16);
  }

  private getConfigVariablesGroup(
    group: ConfigVariablesGroup,
  ): Array<keyof ConfigVariables> {
    const metadata =
      TypedReflect.getMetadata('config-variables', ConfigVariables) ?? {};

    return Object.keys(metadata)
      .filter((key) => metadata[key].group === group)
      .map((key) => key as keyof ConfigVariables);
  }

  protected abstract buildConfigKey(): string;
  protected abstract createDriver(): TDriver;
}
