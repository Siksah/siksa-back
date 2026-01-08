import { Injectable, Logger } from '@nestjs/common'
import { GeminiUtil } from '../utils/gemini.util'
import { GenerateTextDto } from '../dto/generate-text.dto'
import { safeStringify } from '../utils/utils'
import { LUNCH_PROMPT_MAPS } from '../constants/lunch-data';

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
    const userContext = Object.entries(answers)
    .filter(([key]) => !EXCLUDE_KEYS.includes(key)) // 불필요한 키 제외
      .map(([key, value]) => {
        const map = LUNCH_PROMPT_MAPS[key];
        const displayValue = (map && map[value]) ? map[value] : value;
        console.log(displayValue);
        return map ? `- ${key}: ${map[value]}` : `- ${key}: ${value}`;
      })
      .join('\n');

    const fullPrompt = `
  당신은 최고의 메뉴 추천 가이드입니다. 
  다음과 같은 사용자의 상황과 취향을 분석하여 점심 메뉴 3가지를 추천해주세요.

  [사용자 취향]
  ${userContext}

  반드시 아래 JSON 형식으로만 응답하세요. 다른 설명이나 인삿말은 생략하세요:
  {
    "recommendations": [
      { 
        "rank": 1, 
        "menu": "메뉴명", 
        "category": "일식/한식/중식 등",
      },
      ... (3순위까지)
    ]
  }
    `;

    console.log('fullPrompt', fullPrompt);
    return this.generateText({
      prompt: fullPrompt,
      model: 'gemini-2.5-flash',
    });
  }
}
