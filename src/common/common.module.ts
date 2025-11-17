import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonController } from './controllers/common.controller';
import { GeminiUtil } from './utils/gemini.util';

@Module({
  imports: [ConfigModule],
  controllers: [CommonController],
  providers: [GeminiUtil],
})
export class CommonModule {}
