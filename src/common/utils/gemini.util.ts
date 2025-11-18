import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { GenerateTextDto } from '../dto/generate-text.dto';

@Injectable()
export class GeminiUtil {
  private readonly genAI: GoogleGenAI;

  constructor() {
    this.genAI = new GoogleGenAI({});
  }

  async generateText(reqData: GenerateTextDto): Promise<string> {
    /**
     * model: 'gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.5-flash
     * contents: string | Array<{ text: string }>
     * config: {
     *   thinkingConfig: {
     *    // static : 0 is stop thinking
     *     thinkingBudget: 0 ~ 24576  // gemini-2.5-flash
     *     thinkingBudget: 128 ~ 32768 // gemini-2.5-pro
     *    // dynamic
     *     thinkingBudget: -1
     *   }
     *   temperature: 0.0 ~ 2.0
     * }
     */
    const response = await this.genAI.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: reqData.prompt,
      config: {
        thinkingConfig: { thinkingBudget: reqData.config.thinkingBudget || 0 },
        temperature: reqData.config.temperature || 1.0,
      },
    });

    let fullText = '';
    let metaData;

    for await (const chunk of response) {
      fullText += chunk.text;

      if (chunk.usageMetadata) {
        metaData = chunk.usageMetadata;
      }
    }

    console.log(metaData);

    return fullText;
  }
}
