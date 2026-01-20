import { Injectable, Logger } from '@nestjs/common'
import { GeminiUtil } from '../utils/gemini.util'
import { GenerateTextDto } from '../dto/generate-text.dto'
import { safeStringify } from '../utils/utils'
import { LUNCH_PROMPT_MAPS } from '../constants/lunch-data';
import { MENU_RECOMMENDATION_SYSTEM_PROMPT } from '../constants/prompts';

@Injectable()
export class CommonService {
  private readonly logger = new Logger(CommonService.name)

  constructor(private readonly geminiUtil: GeminiUtil) {}

  async generateText(dto: GenerateTextDto): Promise<{ text: string; metaData?: any; time?: number }> {
    const { text, metaData, time } = await this.geminiUtil.generateText2(dto)

    this.logger.debug(`dto: ${safeStringify(dto)}`)
    this.logger.debug(`text: ${text}`)
    this.logger.debug(`metaData: ${safeStringify(metaData)}`)
    this.logger.debug(`time: ${time}`)

    if (dto.isAdmin) {
      return { text, metaData, time }
    }

    return { text }
  }

  async generateMenuRecommendation(answers: Record<string, string>) {
    this.logger.log(`answers: ${answers}`);
      
    // 불필요한 키는 필터링하고 label만 추출
    const extractedValues = Object.entries(answers)
    .filter(([key]) => !['sessionId', 'timestamp', 'Result_Type'].includes(key))
    .reduce((acc, [key, value]: [string, any]) => {
      
      if (key === 'answers') {
        Object.entries(value as Record<string, any>).forEach(([subKey, content]) => {
          acc[subKey] = content.value;
        });
      }
      return acc;
    }, {});
    this.logger.log(`extractedValues: ${extractedValues}`);

    const jsonContext = JSON.stringify(extractedValues, null, 2);

  const fullPrompt = `
${MENU_RECOMMENDATION_SYSTEM_PROMPT}

${jsonContext}
  `;

    this.logger.log(`filteredContext: ${jsonContext}`);
    return this.generateText({
      prompt: fullPrompt,
      model: 'gemini-2.5-flash',
    });
  }
}
