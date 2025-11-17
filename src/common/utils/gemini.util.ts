import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiUtil {
  private readonly genAI: GoogleGenAI;

  constructor() {
    this.genAI = new GoogleGenAI({});
  }

  async generateText(prompt: string): Promise<string> {
    const response = await this.genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text ?? '';
  }
}
