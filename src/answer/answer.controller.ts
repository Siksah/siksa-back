import { Controller, Post, Body, HttpCode, HttpStatus, Logger, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AnswerDto } from './dto/answer.dto';
import { AnswerService } from './answer.service';

const SESSION_COOKIE_NAME = 'anon_session_id';

@Controller() // 기본 경로 (prefix 없음)
export class answerController {
  // 로거 인스턴스를 사용하여 깔끔하게 콘솔에 출력합니다.
  private readonly logger = new Logger(answerController.name);

 // 1. AnswerService 주입 (필수!)
  constructor(private readonly answerService: AnswerService) {} 

  @Post('answer')
  @HttpCode(HttpStatus.OK)
  async handleUserAnswer(
    @Req() req: any,
    @Body() answerData: AnswerDto
  ): Promise<{ message: string, data: any }> { 
    
    try {
      // 1. 쿠키에서 sessionId 추출 (없을 경우 DTO에 담긴 값 사용)
      // main.ts의 session name과 일치해야 함
      const sessionIdFromCookie = req.cookies?.['anon_session_id'] || req.sessionID;

      console.log('sessionIdFromCookie', sessionIdFromCookie);
      // 2. 데이터 보정 (DTO에 sessionId 주입)
      const finalData = {
        ...answerData,
        sessionId: sessionIdFromCookie || answerData.sessionId, 
      };

      this.logger.log(`Saving answer for session: ${finalData.sessionId}`);
      
      // 3. AnswerService의 create 메서드를 호출하여 MongoDB에 저장
      // const savedDocument = await this.answerService.create(answerData);
      const savedDocument = await this.answerService.create(finalData as any);

      return {
        message: 'User answers saved successfully to MongoDB.',
        data: savedDocument
      };

    } catch (error) {
        const err = error as Error; 
        this.logger.error('🚨 MongoDB 저장 중 심각한 오류 발생:', err.message, err.stack);
        throw error; 
    }
  }
}