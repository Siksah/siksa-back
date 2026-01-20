import { Module } from '@nestjs/common';
import { AnalyzeController } from './analyze.controller';
import { AnalyzeService } from './analyze.service';

@Module({
  controllers: [AnalyzeController],
  providers: [AnalyzeService],
  exports: [AnalyzeService], // 다른 모듈에서 사용이 필요할 경우
})
export class AnalyzeModule {}