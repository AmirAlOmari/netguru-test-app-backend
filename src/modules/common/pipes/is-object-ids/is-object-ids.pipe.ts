import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class IsObjectIdsPipe implements PipeTransform {
  transform(values: string[], metadata: ArgumentMetadata) {
    try {
      const objectIds = values.forEach(value => {
        const isValidObjectId = Types.ObjectId.isValid(value);

        if (!isValidObjectId) {
          throw new BadRequestException();
        }

        const objectId = new Types.ObjectId(value);

        return objectId;
      });

      return objectIds;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
