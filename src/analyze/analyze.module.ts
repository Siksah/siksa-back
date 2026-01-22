import { Module } from '@nestjs/common';
import { AnalyzeController } from './analyze.controller';
import { AnalyzeService } from './analyze.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Feedback, FeedbackSchema } from './schemas/feedback.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feedback.name, schema: FeedbackSchema }]),
  ],
  controllers: [AnalyzeController],
  providers: [AnalyzeService],
  exports: [AnalyzeService], // 다른 모듈에서 사용이 필요할 경우
})
export class AnalyzeModule {}