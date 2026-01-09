import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import {
  GoogleGenAI,
  UsageMetadata,
  GenerateContentResponse,
  ThinkingLevel,
  GenerateContentParameters,
} from '@google/genai'
import { GenerateTextDto } from '../dto/generate-text.dto'
import { safeStringify } from './utils'
import { ConfigService } from '@nestjs/config';

/**
 * reqType: 'text', 'image', 'audio'
 * reqType에 따라 dto가 다르게 구성되어야 함
 * 일단 text일 경우만 제작
 * model이 gemini-3일 경우 thinkingLevel이 필요함
 * model이 gemini-2.5일 경우 thinkingBudget이 필요함
 */
export function applyModelDefaults(reqType: string, dto: GenerateTextDto) {
  if (reqType === 'text') {
    const { model, prompt, config } = dto
    const thinkingLevel = config?.thinkingLevel ?? ThinkingLevel.LOW
    const thinkingBudget = config?.thinkingBudget ?? -1
    const temperature = config?.temperature ?? 1.0
    // const thinkingBudget = config?.thinkingBudget ?? 0 // Thinking 기능 끄기
    // const temperature = config?.temperature ?? 0.2;

    const result: GenerateContentParameters = {
      model: model,
      contents: prompt,
    }

    if (model === 'gemini-3-pro-preview') {
      result.config = {
        thinkingConfig: {
          thinkingLevel: thinkingLevel,
        },
      }
    } else {
      if (model === 'gemini-2.5-pro') {
        if (thinkingBudget != -1 && (thinkingBudget < 128 || thinkingBudget > 32768)) {
          throw new BadRequestException('thinkingBudget must be between 128 and 32768')
        }
      } else if (model === 'gemini-2.5-flash') {
        if (thinkingBudget != -1 && (thinkingBudget < 0 || thinkingBudget > 24576)) {
          throw new BadRequestException('thinkingBudget must be between 0 and 24576')
        }
      }
      result.config = {
        thinkingConfig: {
          thinkingBudget: thinkingBudget,
        },
        temperature: temperature,
        responseMimeType: "application/json", // Gemini가 JSON만 생성하도록 강제
      }
    }
    return result
  } else {
    throw new BadRequestException('reqType must be text now')
  }
}

@Injectable()
export class GeminiUtil {
  private readonly genAI: GoogleGenAI
  private readonly logger = new Logger(GeminiUtil.name)

  constructor(private readonly configService: ConfigService) {
    // 로컬 .env 또는 도커 환경변수 모두에서 키를 가져옵니다.
    const apiKey = this.configService.get<string>('GOOGLE_GENAI_API_KEY');
    
    this.genAI = new GoogleGenAI({
      apiKey: apiKey, 
    });
  }
  // constructor() {
  //   this.genAI = new GoogleGenAI({})
  // }

  async generateText(reqData: GenerateTextDto): Promise<{ text: string; metaData?: UsageMetadata; time?: number }> {
    const params = applyModelDefaults('text', reqData)
    this.logger.debug(`params: ${safeStringify(params)}`)

    const startTime = Date.now()
    let response: AsyncGenerator<GenerateContentResponse> | undefined
    try {
      response = await this.genAI.models.generateContentStream(params)
      this.logger.debug(`response: ${response}`)
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
    const endTime = Date.now()
    this.logger.debug(`metaData: ${safeStringify(metaData)}`)
    this.logger.debug(`time: ${endTime - startTime}`)

    return { text: fullText, metaData, time: endTime - startTime }
  }


  async generateText2(reqData: GenerateTextDto): Promise<{ text: string; metaData?: UsageMetadata; time?: number }> {
    const params = applyModelDefaults('text', reqData);
    this.logger.debug(`params: ${safeStringify(params)}`);

    const startTime = Date.now();
    
    try {
      // 1. stream 방식이 아닌 단일 응답(generateContent)을 호출합니다.
      const result = await this.genAI.models.generateContent(params);
      
      // 2. 응답에서 텍스트와 메타데이터를 직접 추출합니다.
      // .text()는 메서드이므로 실행()이 필요할 수 있으나, SDK 버전에 따라 다를 수 있습니다.
      const fullText = result.text || '';
      const metaData = result.usageMetadata;
      const endTime = Date.now();

      this.logger.debug(`metaData: ${safeStringify(metaData)}`);
      this.logger.debug(`time: ${endTime - startTime}`);

      return { 
        text: fullText, 
        metaData, 
        time: endTime - startTime 
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
