import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class SplitPipe implements PipeTransform {
  transform(value: string = '', metadata: ArgumentMetadata) {
    try {
      value = value.toString();

      const splitted = value.split(',');

      return splitted;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
