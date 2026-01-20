import { Controller, Post, Body, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { CreateFeedbackDto } from './dto/feedback.dto';

// 통계 관련 
@Controller()
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post('feedback')
  @HttpCode(HttpStatus.CREATED)
  async saveFeedback(@Body() dto: CreateFeedbackDto) {
    // 1. 필수 값 검증 (간단한 예시)
    if (!dto.sessionId || !dto.feedback) {
      throw new BadRequestException('sessionId and feedback are required');
    }

    // 2. 서비스 레이어를 통해 MongoDB에 저장
    try {
      const result = await this.analyzeService.recordFeedback(dto);
      return {
        success: true,
        message: 'Feedback recorded successfully',
        data: result,
      };
    } catch (error) {
      throw new BadRequestException('Failed to save feedback data');
    }
  }




  // 나중에 "식당 찾아보기" 클릭 시 로그를 남기고 싶다면 추가
  @Post('click-log')
  @HttpCode(HttpStatus.OK)
  async saveClickLog(@Body() data: any) {
    return await this.analyzeService.recordAction(data);
  }
}