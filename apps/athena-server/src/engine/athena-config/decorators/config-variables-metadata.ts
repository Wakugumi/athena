import { TypedReflect } from 'src/utils/typed-reflect';
import { ConfigVariableType } from '../enums/config-variable-type.enum';
import { ConfigVariablesGroup } from '../enums/config-variables-group.enum';
import { ConfigVariableOptions } from '../types/config-variable-options.type';
import {
  IsOptional,
  isValidationOptions,
  ValidationOptions,
} from 'class-validator';

export interface ConfigVariablesMetadataOptions {
  group: ConfigVariablesGroup;
  description?: string;
  isSensitive?: boolean;
  isEnvOnly?: boolean;
  type: ConfigVariableType;
  options?: ConfigVariableOptions;
}

export type ConfigVariablesMetadataMap = {
  [key: string]: ConfigVariablesMetadataOptions;
};

export function ConfigVariablesMetadata(
  options: ConfigVariablesMetadataOptions,
  validaitonOptions?: ValidationOptions,
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    const existingMetadata: ConfigVariablesMetadataMap =
      TypedReflect.getMetadata('config-variables', target.constructor) ?? {};

    TypedReflect.defineMetadata(
      'config-variables',
      {
        ...existingMetadata,
        [propertyKey as string]: options,
      },
      target.constructor,
    );

    const propertyDescriptor = Object.getOwnPropertyDescriptor(
      target.constructor.prototype,
      propertyKey,
    );

    const hasDefaultValue =
      propertyDescriptor &&
      'value' in propertyDescriptor &&
      propertyDescriptor.value !== undefined;

    if (!hasDefaultValue) {
      IsOptional()(target, propertyKey);
    }
  };
}
