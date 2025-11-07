import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 💡 1. React 앱의 주소 (http://localhost:5173)를 허용하는 CORS 설정
  app.enableCors({
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 💡 2. NestJS 서버 포트를 3001로 변경
  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);

}
bootstrap();
