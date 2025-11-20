import { Body, Controller, Logger, Post } from '@nestjs/common'
import { GenerateTextDto } from '../dto/generate-text.dto'
import { GeminiUtil } from '../utils/gemini.util'

@Controller('api/common')
export class CommonController {
  logger = new Logger(CommonController.name)

  constructor(private readonly geminiUtil: GeminiUtil) {}

  @Post('gemini/text')
  async generate(@Body() generateTextDto: GenerateTextDto): Promise<{ text: string }> {
    this.logger.debug(`generateTextDto: ${JSON.stringify(generateTextDto)}`)

    const text = await this.geminiUtil.generateText(generateTextDto)

    this.logger.debug(`text: ${text}`)
    return { text }
  }
}
