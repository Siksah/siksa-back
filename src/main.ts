import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { GlobalExceptionFilter } from './common/filters/global-exception.filter'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'

import { winstonLogger } from './common/utils/winston.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  })

  // 1. React 앱의 주소 (http://localhost:5173)를 허용하는 CORS 설정
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  // 2. 전역 유효성 검사 파이프 설정 (DTO 사용을 위해 필수)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성은 제거
      transform: true, // DTO 타입으로 자동 변환
    }),
  )

  // 전역 예외 필터 설정
  app.useGlobalFilters(new GlobalExceptionFilter())

  // 전역 응답 인터셉터 설정
  app.useGlobalInterceptors(new TransformInterceptor())

  // 3. 앱 리스닝 시작 (프론트엔드에서 설정한 포트 3001을 사용)
  await app.listen(3001)
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
