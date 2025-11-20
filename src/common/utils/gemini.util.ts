import { Injectable, Logger } from '@nestjs/common'
import {
  GoogleGenAI,
  UsageMetadata,
  GenerateContentResponse,
  ThinkingLevel,
  GenerateContentParameters,
} from '@google/genai'
import { GenerateTextDto } from '../dto/generate-text.dto'

/**
 * reqType: 'text', 'image', 'audio'
 * reqType에 따라 dto가 다르게 구성되어야 함
 * 일단 text일 경우만 제작
 * model이 gemini-3일 경우 thinkingLevel이 필요함
 * model이 gemini-2.5일 경우 thinkingBudget이 필요함
 */
function applyModelDefaults(reqType: string, dto: GenerateTextDto) {
  if (reqType === 'text') {
    const model = dto.model
    const thinkingLevel = dto.config?.thinkingLevel == undefined ? ThinkingLevel.LOW : dto.config?.thinkingLevel
    const thinkingBudget = dto.config?.thinkingBudget == undefined ? -1 : dto.config?.thinkingBudget
    const temperature = dto.config?.temperature == undefined ? 1.0 : dto.config?.temperature
    const contents = dto.prompt
    const result: GenerateContentParameters = {
      model: model,
      contents: contents,
    }

    if (model === 'gemini-3-pro-preview') {
      result.config = {
        thinkingConfig: {
          thinkingLevel: thinkingLevel,
        },
        temperature: temperature,
      }
    } else if (model === 'gemini-2.5-pro') {
      if (thinkingBudget != -1 && (thinkingBudget < 128 || thinkingBudget > 32768)) {
        throw new Error('thinkingBudget must be between 128 and 32768')
      }
      result.config = {
        thinkingConfig: {
          thinkingBudget: thinkingBudget,
        },
        temperature: temperature,
      }
    } else if (model === 'gemini-2.5-flash') {
      if (thinkingBudget != -1 && (thinkingBudget < 0 || thinkingBudget > 24576)) {
        throw new Error('thinkingBudget must be between 0 and 24576')
      }
      result.config = {
        thinkingConfig: {
          thinkingBudget: thinkingBudget,
        },
        temperature: temperature,
      }
    }
    return result
  } else {
    throw new Error('reqType must be text now')
  }
}

@Injectable()
export class GeminiUtil {
  private readonly genAI: GoogleGenAI
  private readonly logger = new Logger(GeminiUtil.name)

  constructor() {
    this.genAI = new GoogleGenAI({})
  }
  async generateText(reqData: GenerateTextDto): Promise<string> {
    const params = applyModelDefaults('text', reqData)
    this.logger.debug(`params: ${JSON.stringify(params)}`)

    let response: AsyncGenerator<GenerateContentResponse> | undefined
    try {
      response = await this.genAI.models.generateContentStream(params)
    } catch (error) {
      this.logger.error(error)
      throw error
    }

    let fullText = ''
    let metaData: UsageMetadata | undefined

    for await (const chunk of response) {
      fullText += chunk.text

      if (chunk.usageMetadata) {
        metaData = chunk.usageMetadata
      }
    }

    this.logger.log(`metaData: ${JSON.stringify(metaData)}`)

    return fullText
  }
}
