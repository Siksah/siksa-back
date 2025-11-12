import { Module } from '@nestjs/common';
import { GeminiAiService } from './gemini-ai.service';
import { GeminiAiController } from './gemini-ai.controller';

@Module({
  controllers: [GeminiAiController],
  providers: [GeminiAiService],
})
export class GeminiAiModule {}
