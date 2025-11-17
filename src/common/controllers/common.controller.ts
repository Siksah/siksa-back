import { Body, Controller, Post } from '@nestjs/common';
import { GenerateTextDto } from '../dto/generate-text.dto';
import { GeminiUtil } from '../utils/gemini.util';

@Controller('common')
export class CommonController {
  constructor(private readonly geminiUtil: GeminiUtil) {}

  @Post('generate')
  async generate(
    @Body() generateTextDto: GenerateTextDto,
  ): Promise<{ text: string }> {
    const text = await this.geminiUtil.generateText(generateTextDto.prompt);
    return { text };
  }
}
