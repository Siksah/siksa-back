import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Feedback extends Document {
  @Prop()
  sessionId!: string;

  @Prop()
  retryCount!: string;

  @Prop({ type: Object })
  device: any;

  @Prop({ type: Object })
  result: any;

  @Prop()
  feedback!: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);