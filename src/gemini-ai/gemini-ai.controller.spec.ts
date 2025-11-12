import { Test, TestingModule } from '@nestjs/testing';
import { GeminiAiController } from './gemini-ai.controller';
import { GeminiAiService } from './gemini-ai.service';

describe('GeminiAiController', () => {
  let controller: GeminiAiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeminiAiController],
      providers: [GeminiAiService],
    }).compile();

    controller = module.get<GeminiAiController>(GeminiAiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
