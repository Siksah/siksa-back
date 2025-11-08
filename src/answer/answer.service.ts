import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Answer, AnswerDocument } from './schemas/answer.schema';
import { AnswerDto } from './dto/answer.dto';

@Injectable()
export class AnswerService {
  // Answer 모델 주입
  constructor(
    @InjectModel(Answer.name) private answerModel: Model<AnswerDocument>,
  ) {}

  /**
   * MongoDB에 사용자 응답 데이터를 저장합니다.
   * @param answerUserDto 프론트엔드에서 받은 AnswerUserDto
   */
  async create(answerUserDto: AnswerDto): Promise<AnswerDocument> {
    // DTO에서 받은 string 타입의 timestamp를 Date 객체로 변환하여 저장합니다.
    const createdAnswer = new this.answerModel({
      ...answerUserDto,
      timestamp: new Date(answerUserDto.timestamp), 
    });
    
    return createdAnswer.save();
  }
}