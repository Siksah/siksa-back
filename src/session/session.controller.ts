import { Controller, Get, Post, Res, Req, UnauthorizedException } from '@nestjs/common';
// ⚠️ express가 아닌 확장된 Request 타입을 사용하도록 수정합니다.
// 세션 미들웨어가 Express 기반이므로 'express'에서 가져옵니다.
import type { Response, Request } from 'express';
import { SessionsService } from './sessions.service';
// AppService는 SessionController에서 사용하지 않으므로 제거합니다.

const SESSION_COOKIE_NAME = 'anon_session_id';

@Controller('session')
export class SessionController {

  constructor(private readonly sessionsService: SessionsService) {}
  
  // AppService 주입이 필요 없다면 제거합니다. (SessionController에서 사용하지 않기 때문)
  // constructor(private readonly appService: AppService) {} 
  
  @Get('create-anonymous')
  //createAnonymousSession(@Req() req: Request): { sessionId: string; message: string } {
  async createAnonymousSession(@Req() req: Request): Promise<{ sessionId: string; message: string }> {
    
    let message: string;
    let currentAnonymousId = req.session.anonymousId; // 현재 익명 ID 상태 저장

    // req.session.anonymousId는 이제 타입 에러가 나지 않습니다.
    if (!currentAnonymousId) {
        // 고유값 생성 로직
        const newAnonymousId = Date.now().toString() + Math.random().toFixed(5);
        req.session.anonymousId = newAnonymousId; 
        currentAnonymousId = newAnonymousId;
        message = '새로운 익명 세션 생성';

        // **중요**: 세션 데이터가 변경되었음을 서버에 알립니다.
        // `saveUninitialized: true` 때문에 세션 자체는 이미 존재하지만, 
        // 새로운 데이터(anonymousId)를 저장하려면 save()를 명시적으로 호출할 수도 있습니다.
        // 하지만 일반적으로 세션 미들웨어가 응답 직전에 자동으로 저장합니다.

        // 2. 🚀 [필수 수정]: save()를 await하여 MongoDB에 저장이 완료될 때까지 대기
        await new Promise<void>((resolve, reject) => {
          req.session.save((err) => {
            if (err) {
              // 저장 중 오류 발생 시
              console.error('Error saving session:', err);
              return reject(err);
            }
            resolve(); // 저장이 성공적으로 완료됨
          });
        });
    } else {
        message = '기존 익명 세션 유지';
    }

    return {
        sessionId: req.sessionID,
        message: message,
    };
  }

  @Post('create')
  async create(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('create req', req);
    const clientIp = req.ip;
    const initialData = { ip: clientIp }; // 익명 세션의 초기 데이터

    console.log('initialData', initialData);
    // 1. 세션 ID 생성 및 MongoDB에 TTL과 함께 저장
    const sessionId = await this.sessionsService.createSession(initialData);
    

    // 2. 응답 헤더에 Session Cookie 설정
    // 💡 maxAge/expires 미지정: 브라우저 세션 쿠키로 동작 (탭/브라우저 닫으면 삭제)
    res.cookie(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax',
    });

    return { message: 'Session created', sessionId };
  }
  
  @Post('check')
  async checkSession(@Req() req: Request) {
    const sessionId = req.cookies[SESSION_COOKIE_NAME];
    
    if (!sessionId) {
      // 쿠키가 없으면 새 탭/브라우저에서 접속한 것으로 간주
      throw new UnauthorizedException('No session cookie found');
    }
    
    // 3. MongoDB에서 세션 조회 (TTL이 지나면 자동으로 null 반환됨)
    const session = await this.sessionsService.findSession(sessionId);
    
    if (!session) {
      // MongoDB에 세션이 없으면 30분이 지나 만료된 것입니다.
      throw new UnauthorizedException('Session expired');
    }
    
    return { data: 'Session is valid!', sessionData: session.data };
  }

}