import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // 1. ConfigModule을 가장 먼저 로드합니다.
    ConfigModule.forRoot({
      isGlobal: true, // 전역에서 ConfigService를 사용할 수 있도록 설정
    }),

    // 2. MongooseModule을 비동기적으로 설정합니다 (useFactory 사용)
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // ConfigService를 사용하기 위해 ConfigModule 임포트
      useFactory: async (configService: ConfigService) => ({
        // .env 파일의 DATABASE_URL 값을 가져와서 사용
        // 💡 MongoDB 연결 문자열 (로컬 MongoDB가 실행 중이어야 합니다)
        uri: configService.get<string>('DATABASE_URL'), 
      }),
      inject: [ConfigService], // ConfigService 주입
    }),

  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
