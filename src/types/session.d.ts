import 'express-session';

// express-session의 SessionData 인터페이스를 확장합니다.
declare module 'express-session' {
  interface SessionData {
    // 우리가 익명 세션에서 사용할 속성을 여기에 추가합니다.
    anonymousId?: string | number;
    // 나중에 로그인 기능 추가 시 사용할 속성도 여기에 추가할 수 있습니다.
    userId?: number;
  }
}

// express-serve-static-core의 Request 인터페이스를 확장합니다.
// 이렇게 해야 @Req() req: Request 에서 req.session을 사용할 수 있습니다.
declare module 'express-serve-static-core' {
  interface Request {
    session: expressSession.Session & expressSession.SessionData;
  }
}