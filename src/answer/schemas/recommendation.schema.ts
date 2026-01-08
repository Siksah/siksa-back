import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RecommendationDocument = Recommendation & Document;

@Schema({ timestamps: true }) // 생성 시간 자동 기록
export class Recommendation {
  @Prop({ type: Types.ObjectId, ref: 'Answer', required: true })
  answerId?: Types.ObjectId; // 어떤 답변에 대한 추천인지 연결

  @Prop()
  sessionId?: string;

  @Prop({ type: Array })
  items?: any[]; // Gemini가 준 [순위, 메뉴명, 카테고리] 배열

  @Prop({ 
    required: true, 
    default: () => new Date(),
  })
  timestamp!: Date; 
}

export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);