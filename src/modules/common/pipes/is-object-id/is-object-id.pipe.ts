import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class IsObjectIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    try {
      const isValidObjectId = Types.ObjectId.isValid(value);

      if (!isValidObjectId) {
        throw new BadRequestException();
      }

      const objectId = new Types.ObjectId(value);

      return objectId;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
