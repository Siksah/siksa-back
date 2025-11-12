import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

@Injectable()
export class GeminiAiService {
  async getHello(): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: '만나서 반갑다. 한국어로 인사해다오.',
    });
    return response.text ?? '';
  }
}
