import { Controller, Get } from '@nestjs/common';
import { GeminiAiService } from './gemini-ai.service';

@Controller('gemini-ai')
export class GeminiAiController {
  constructor(private readonly geminiAiService: GeminiAiService) {}

  @Get()
  getHello(): Promise<string> {
    return this.geminiAiService.getHello();
  }
}
