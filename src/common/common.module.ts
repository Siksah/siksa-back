import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CommonController } from './controllers/common.controller'
import { GeminiUtil } from './utils/gemini.util'
import { CommonService } from './services/common.service'

@Module({
  imports: [ConfigModule],
  controllers: [CommonController],
  providers: [GeminiUtil, CommonService],
})
export class CommonModule {}
