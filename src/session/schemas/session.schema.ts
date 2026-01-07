import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema()
export class Session {
  // 세션 ID (쿠키에 담길 값)
  @Prop({ required: true, unique: true, index: true })
  sessionId!: string;

  // 세션 생성 시간 (TTL 인덱스의 기준이 될 필드)
  @Prop({ 
    required: true, 
    default: () => new Date(),
  })
  createdAt!: Date; 

  // 세션 관련 데이터 (예: IP 주소, 사용자가 클릭한 초기 정보 등)
  @Prop({ type: Object })
  data!: Record<string, any>;
}

export const SessionSchema = SchemaFactory.createForClass(Session);