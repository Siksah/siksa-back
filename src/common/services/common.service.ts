import { Injectable, Logger } from '@nestjs/common'
import { GeminiUtil } from '../utils/gemini.util'
import { GenerateTextDto } from '../dto/generate-text.dto'

@Injectable()
export class CommonService {
  private readonly logger = new Logger(CommonService.name)

  constructor(private readonly geminiUtil: GeminiUtil) {}

  async generateText(dto: GenerateTextDto): Promise<{ text: string; metaData?: any }> {
    const { text, metaData } = await this.geminiUtil.generateText(dto)

    this.logger.log(`dto: ${JSON.stringify(dto)}`)
    this.logger.log(`text: ${text}`)
    this.logger.log(`metaData: ${JSON.stringify(metaData)}`)

    if (dto.isAdmin) {
      return { text, metaData }
    }

    return { text }
  }
}
