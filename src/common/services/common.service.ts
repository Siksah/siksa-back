import { Injectable, Logger } from '@nestjs/common'
import { GeminiUtil } from '../utils/gemini.util'
import { GenerateTextDto } from '../dto/generate-text.dto'
import { safeStringify } from '../utils/utils'

@Injectable()
export class CommonService {
  private readonly logger = new Logger(CommonService.name)

  constructor(private readonly geminiUtil: GeminiUtil) {}

  async generateText(dto: GenerateTextDto): Promise<{ text: string; metaData?: any; time?: number }> {
    const { text, metaData, time } = await this.geminiUtil.generateText(dto)

    this.logger.debug(`dto: ${safeStringify(dto)}`)
    this.logger.debug(`text: ${text}`)
    this.logger.debug(`metaData: ${safeStringify(metaData)}`)
    this.logger.debug(`time: ${time}`)

    if (dto.isAdmin) {
      return { text, metaData, time }
    }

    return { text }
  }
}
