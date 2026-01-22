import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'; // 스키마 생성 후 주입 필요
import { Model } from 'mongoose';

@Injectable()
export class AnalyzeService {
  private readonly logger = new Logger(AnalyzeService.name);

  constructor(
    @InjectModel('Feedback') private feedbackModel: Model<any>,
    // @InjectModel('ActionLog') private actionLogModel: Model<any>,
  ) {}

  /**
   * 메뉴 추천 결과에 대한 좋아요/싫어요 데이터 저장
   */
  async recordFeedback(dto: any) {
    try {
      this.logger.log('recordFeedback dto:', dto);
      
      const newFeedback = new this.feedbackModel(dto);
      return newFeedback.save();
      
    } catch (error) {
        
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error(`Failed to record feedback: ${errorMessage}`, errorStack);
      throw error;
    }
  }

  /**
   * 유저의 특정 행동(버튼 클릭, 다시하기 등) 로그 저장
   */
  async recordAction(dto: any) {
    try {
      this.logger.log(`Recording action: ${dto.actionType}`);
      
      // TODO: const newAction = new this.actionLogModel(dto);
      // return await newAction.save();
      
      return { success: true, recordedAt: new Date() };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error(`Failed to record action log: ${errorMessage}`, errorStack);
      throw error;
    }
  }
}