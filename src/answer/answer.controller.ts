import { Controller, Post, Body, HttpCode, HttpStatus, Logger, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AnswerDto } from './dto/answer.dto';
import { AnswerService } from './answer.service';
import { CommonService } from '../common/services/common.service';

const SESSION_COOKIE_NAME = 'anon_session_id';

@Controller() // 기본 경로 (prefix 없음)
export class answerController {
  // 로거 인스턴스를 사용하여 깔끔하게 콘솔에 출력합니다.
  private readonly logger = new Logger(answerController.name);

 // 1. AnswerService 주입 (필수!)
  constructor(
    private readonly answerService: AnswerService,
    private readonly commonService: CommonService,
  ) {} 

  @Post('answer')
  @HttpCode(HttpStatus.OK)
  async handleUserAnswer(
    @Req() req: any,
    @Body() answerData: AnswerDto
  // ): Promise<{ message: string, data: any }> { 
  ): Promise<{ message: string; data: any; savedAnswer: any; recommendation: any; answerId: string }> {
    
    try {
      this.logger.log(`Saving answerData : ${JSON.stringify(answerData)}`);

      // 사용자 답변 저장
      let startTime = Date.now();
      const savedAnswer = await this.answerService.create(answerData);
      let endTime = Date.now();
      this.logger.log(`[성공] 답변 저장 완료 - ID: ${savedAnswer._id}, 처리 시간 : ${endTime - startTime}`);
      
      // Gemini 메뉴 추천 호출 (AI 로직)
      startTime = Date.now();
      const geminiResult = await this.commonService.generateMenuRecommendation(answerData as any);
      endTime = Date.now();
      this.logger.log(`[성공] 메뉴 추천 완료, 처리 시간 : ${endTime - startTime}`);

      // geminiResult가 문자열일 경우를 대비한 recommendations 추출 로직
      // CommonService에서 이미 JSON.parse를 했다면 그대로 사용하고, 
      // 아니라면 여기서 파싱 처리가 필요
      let recommendations = [];

      try {
        // 백틱(```json)이나 불필요한 공백을 제거하고 파싱
        const cleanJson = geminiResult.text.replace(/```json|```/g, '').trim();
        const parsedData = JSON.parse(cleanJson);
        
        // JSON 구조가 { "recommendations": [...] } 인지 아니면 바로 배열인지 체크
        recommendations = parsedData.recommendations || (Array.isArray(parsedData) ? parsedData : []);
      } catch (parseError) {
        this.logger.error('Gemini 결과 파싱 실패:', geminiResult.text);
        // 파싱 실패 시 빈 배열이나 기본 메시지 처리
      }

      // 추천 결과 저장
      // 발급받은 savedAnswer._id를 사용하여 추천 결과를 별도 저장
      const savedRecommendation = await this.answerService.saveRecommendation({
        answerId: savedAnswer._id, // 핵심: 두 데이터를 연결하는 고리
        sessionId: answerData.sessionId,
        items: recommendations
      });
      this.logger.log(`[성공] 추천 데이터 저장 완료 - ID: ${savedRecommendation._id}`);
        
      // const [savedDocument, geminiResult] = await Promise.all([
      //   this.answerService.create(answerData as any),
      //   this.commonService.generateMenuRecommendation(answerData as any)
      // ]);

      return {
        message: '성공적으로 저장 및 메뉴 추천이 완료되었습니다.',
        data: answerData,
        answerId: savedAnswer._id.toString(),
        savedAnswer: savedAnswer,
        recommendation: recommendations,
      };

    } catch (error) {
        const err = error as Error; 
        this.logger.error('처리 중 오류 발생:', err.message, err.stack);
        throw error; 
    }
  }
}