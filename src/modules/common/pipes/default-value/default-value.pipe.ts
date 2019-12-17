import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, Optional } from '@nestjs/common';

@Injectable()
export class DefaultValuePipe<T = any> implements PipeTransform {
  constructor(@Optional() public readonly defaultValue: T) {}

  public static create<T>(defaultValue: T) {
    return new this(defaultValue);
  }

  transform(value: string, metadata: ArgumentMetadata) {
    try {
      return value ?? this.defaultValue;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
