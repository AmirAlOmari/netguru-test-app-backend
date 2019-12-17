import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, Optional } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PlainToClass implements PipeTransform {
  constructor(@Optional() private readonly cls: any) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    const cls = this.cls || metadata.metatype;

    if (cls) {
      return plainToClass(cls, value);
    }

    return value;
  }
}
