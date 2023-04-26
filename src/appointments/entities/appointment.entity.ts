import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema({ timestamps: true })
export class Appointment {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  date: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
