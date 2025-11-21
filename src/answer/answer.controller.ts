import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { Answer } from './schemas/answer.schema';
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
  async handleUserAnswer(@Body() answerData: AnswerDto): Promise<{ message: string, data: AnswerDto }> { 
    
    try {
      // 2. 💡 AnswerService의 create 메서드를 호출하여 MongoDB에 저장
      const savedDocument = await this.answerService.create(answerData);

      
      return {
        message: 'User answers saved successfully to MongoDB.',
        data: {
            Q1: savedDocument.Q1, 
            Q2: savedDocument.Q2,
            Q6: savedDocument.Q6,
            Result_Type: savedDocument.Result_Type,
            timestamp: savedDocument.timestamp.toISOString(), // Date 객체를 string으로 변환
        } as AnswerDto, // 타입을 맞춥니다.
      };

    } catch (error) {
        // 🚨 DB 저장 중 오류가 발생하면 이 부분이 터미널에 출력됩니다.
        this.logger.error('🚨 MongoDB 저장 중 심각한 오류 발생:', error.message, error.stack);
        throw error; 
    }
  }
}