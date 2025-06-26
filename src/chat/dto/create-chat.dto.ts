/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty } from 'class-validator';

export class CreateChatDTO {
  @IsNotEmpty()
  readonly roomId: string;

  @IsNotEmpty()
  readonly content: string;
}
