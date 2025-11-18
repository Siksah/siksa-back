import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GenerateTextDto } from '../dto/generate-text.dto';
import { GeminiUtil } from '../utils/gemini.util';

@Controller('api/common')
export class CommonController {
  constructor(private readonly geminiUtil: GeminiUtil) {}

  @Post('genai/text')
  @UsePipes(new ValidationPipe({ transform: true }))
  async generate(
    @Body() generateTextDto: GenerateTextDto,
  ): Promise<{ text: string }> {
    const text = await this.geminiUtil.generateText(generateTextDto);
    return { text };
  }
}
