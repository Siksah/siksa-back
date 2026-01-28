import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { GlobalExceptionFilter } from './common/filters/global-exception.filter'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'

import { winstonLogger } from './common/utils/winston.config'
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const session = require('express-session');
const MongoStore = require('connect-mongodb-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              // 메타데이터(객체)가 있으면 문자열로 변환, 없으면 빈 문자열
              const metaStr = Object.keys(meta).length 
                ? `\n${JSON.stringify(meta, null, 2)}` 
                : '';
              return `[${timestamp}] ${level}: ${message}${metaStr}`;
            }),
          ),
        }),
      ],
    }),
  })

  // 모든 API 경로 앞에 /api를 자동으로 붙입니다.
  app.setGlobalPrefix('api');

  // ConfigService 인스턴스 가져오기
  const configService = app.get(ConfigService);
  const MONGO_URI = configService.get<string>('MONGO_URI'); // 환경 변수 이름 확인 필요
  const SESSION_SECRET = configService.get<string>('SESSION_SECRET');

  // cookie-parser 등록 (session보다 먼저 와야 함)
  app.use(cookieParser());

  // React 앱의 주소를 허용하는 CORS 설정
  app.enableCors({
     origin: [
        'http://localhost:5173',       // 1. 로컬호스트 (Vite 기본 포트 예시)
        'http://127.0.0.1:5173',       // 1-1. 로컬호스트 IP 표기
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://www.nyamnyam.kr',
        'https://nyamnyam.kr',
        'https://siksa-frontend-750045356743.asia-northeast3.run.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

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

  const MongoDBStore = MongoStore(session);
  const store = new MongoDBStore({
    uri: MONGO_URI,
    collection: 'sessions', // 세션 데이터를 저장할 컬렉션 이름
  });

  app.use(
    session({
      name: 'anon_session_id', // 쿠키 이름 통일
      secret: SESSION_SECRET, // 세션 암호화 키
      resave: false,
      saveUninitialized: false, // 익명 세션을 위해 필수: 요청이 들어왔을 때 세션에 아무 데이터가 없더라도 저장
      store: store,
      cookie: {
        maxAge: 1000 * 60 * 30, // 30분
        httpOnly: true, // XSS 공격 방지
        secure: process.env.NODE_ENV === 'production', // HTTPS에서만 true
        sameSite: 'none', // lax
      },
    } as expressSession.SessionOptions),
  );
  

  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
