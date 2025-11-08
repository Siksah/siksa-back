import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { answerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { Answer, AnswerSchema } from './schemas/answer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Answer.name, schema: AnswerSchema }]),
  ],
  controllers: [answerController], // AppController 등록
  providers: [AnswerService],
})
export class AnswerModule {}