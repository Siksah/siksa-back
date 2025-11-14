import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

@Controller('session')
export class SessionController {
  @Get('create-anonymous')
  createAnonymousSession(@Req() req: Request): { sessionId: string; message: string } {
    // 1. 요청에 세션이 없으면 `saveUninitialized: true` 설정에 의해 자동으로 새로운 세션이 생성됩니다.
    // 2. 새로운 세션 ID는 응답 헤더의 `Set-Cookie`에 담겨 클라이언트로 전송됩니다.
    
    // 이 시점에서 세션에 고유한 데이터를 저장할 수 있습니다.
    if (!req.session.anonymousId) {
        req.session.anonymousId = Date.now().toString() + Math.random(); // 익명 사용자를 식별할 수 있는 고유값 생성
    }

    return {
        sessionId: req.sessionID,
        message: '익명 세션이 생성되었거나 기존 세션이 사용되었습니다.',
    };
  }
}
