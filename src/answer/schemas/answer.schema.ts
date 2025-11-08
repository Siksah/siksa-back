import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Mongoose Document 타입 정의
export type AnswerDocument = Answer & Document;

@Schema({ timestamps: true }) // MongoDB에 createdAt, updatedAt 필드 자동 생성
export class Answer {
  @Prop({ required: true })
  Q1: string;

  @Prop({ required: true })
  Q2: string;

  @Prop({ required: true })
  Q6: string;

  @Prop()
  Result_Type: string;

  // @Prop({ required: true, index: true })
  // userId: string;
  
  // DTO에서 받은 ISO 문자열은 Service에서 Date 객체로 변환되어 저장됩니다.
  @Prop({ required: true })
  timestamp: Date; 
}

// 스키마 팩토리 생성
export const AnswerSchema = SchemaFactory.createForClass(Answer);