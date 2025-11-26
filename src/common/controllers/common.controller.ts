import { Body, Controller, Post } from '@nestjs/common'
import { GenerateTextDto } from '../dto/generate-text.dto'
import { CommonService } from '../services/common.service'

@Controller('api/common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('gemini/text')
  async generate(@Body() generateTextDto: GenerateTextDto): Promise<{ text: string; metaData?: any }> {
    const result = await this.commonService.generateText(generateTextDto)

    return result
  }
}
