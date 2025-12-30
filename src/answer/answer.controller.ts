import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { AnswerDto } from './dto/answer.dto';
import { AnswerService } from './answer.service';

@Controller() // 기본 경로 (prefix 없음)
export class answerController {
  // 로거 인스턴스를 사용하여 깔끔하게 콘솔에 출력합니다.
  private readonly logger = new Logger(answerController.name);

 // 1. AnswerService 주입 (필수!)
  constructor(private readonly answerService: AnswerService) {} 

  @Post('answer')
  @HttpCode(HttpStatus.OK)
  async handleUserAnswer(@Body() answerData: AnswerDto): Promise<{ message: string, data: any }> { 
    
    try {
      // 2. 💡 AnswerService의 create 메서드를 호출하여 MongoDB에 저장
      const savedDocument = await this.answerService.create(answerData);

      
      return {
        message: 'User answers saved successfully to MongoDB.',
        data: savedDocument
      };

    } catch (error) {
        // 🚨 DB 저장 중 오류가 발생하면 이 부분이 터미널에 출력됩니다.
        const err = error as Error; 
        this.logger.error('🚨 MongoDB 저장 중 심각한 오류 발생:', err.message, err.stack);
        throw error; 
    }
  }
}