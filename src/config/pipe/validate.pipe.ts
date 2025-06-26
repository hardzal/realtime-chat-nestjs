/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';

@Injectable()
export class ValidateInputPipe extends ValidationPipe {
  public async transform(value, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (error) {
      if (error instanceof BadRequestException) {
        const messages = error.getResponse()['message'];
        if (messages) {
          throw new BadRequestException({
            message: messages[0],
            messages: messages,
          });
        } else {
          throw error;
        }
      }
    }
  }
}
