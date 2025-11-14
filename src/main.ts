import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as expressSession from 'express-session';

const session = require('express-session');
const MongoStore = require('connect-mongodb-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ConfigService 인스턴스 가져오기
  const configService = app.get(ConfigService);
  const MONGO_URI = configService.get<string>('MONGO_URI'); // 환경 변수 이름 확인 필요
  const SESSION_SECRET = configService.get<string>('SESSION_SECRET');

  // 1. React 앱의 주소를 허용하는 CORS 설정
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 2. 전역 유효성 검사 파이프 설정 (DTO 사용을 위해 필수)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // DTO에 정의되지 않은 속성은 제거
    transform: true, // DTO 타입으로 자동 변환
  }));

  const MongoDBStore = MongoStore(session);
  const store = new MongoDBStore({
    uri: MONGO_URI,
    collection: 'sessions', // 세션 데이터를 저장할 컬렉션 이름
  });

  app.use(
    session({
      secret: SESSION_SECRET, // 세션 암호화 키
      resave: false,
      saveUninitialized: true, // 익명 세션을 위해 필수: 요청이 들어왔을 때 세션에 아무 데이터가 없더라도 저장
      store: store,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1주일
        httpOnly: true, // XSS 공격 방지
        secure: process.env.NODE_ENV === 'production', // HTTPS에서만 true
      },
    } as expressSession.SessionOptions),
  );
  

  // 3. 앱 리스닝 시작 (프론트엔드에서 설정한 포트 3001을 사용)
  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);

}
bootstrap();
