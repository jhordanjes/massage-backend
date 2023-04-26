import { Prop } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { ObjectId } from 'typeorm';

export class Avatar {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  path: string;
}
