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

  async generateMenuRecommendation(answers: Record<string, string>) {
    // 제외할 키 리스트
    const EXCLUDE_KEYS = ['sessionId', 'Result_Type', 'timestamp'];

    // 답변 ID들을 기반으로 Gemini에게 전달할 문장 조립
    const filteredContext = Object.entries(answers)
      .filter(([key]) => !EXCLUDE_KEYS.includes(key)) // 불필요한 키 제외
      .reduce((obj, [key, value]) => {
      const map = LUNCH_PROMPT_MAPS[key];
      // 매핑 데이터가 있으면 변환된 값을, 없으면 원본 값을 저장
      obj[key] = (map && map[value]) ? map[value] : value;
      return obj;
    }, {});

    // 2. 가공된 객체를 JSON 문자열로 변환
  const inputJson = JSON.stringify(filteredContext, null, 2);
  this.logger.log(`inputJson: ${inputJson}`);

    const fullPrompt = `
${MENU_RECOMMENDATION_SYSTEM_PROMPT}

# 입력 태그(JSON)
${JSON.stringify(inputJson, null, 2)}
  `;

    this.logger.log(`fullPrompt: ${fullPrompt}`);
    return this.generateText({
      prompt: fullPrompt,
      model: 'gemini-2.5-flash',
    });
  }
}
