# 1. 빌드 단계 (Build Stage)
FROM node:lts-alpine as builder 

WORKDIR /app

# package.json 파일 복사 (Docker Compose context가 . 이므로, 경로 명시)
COPY ./package*.json ./
RUN npm install

# 나머지 NestJS 소스 코드 복사 (context가 . 이므로, 경로 명시)
COPY . . 

# NestJS 프로덕션 빌드 (TypeScript를 JavaScript로 변환)
RUN npm run build 

# ----------------------------------------------------

# 2. 프로덕션 단계 (Production Stage)
FROM node:lts-alpine as production

ENV NODE_ENV production

WORKDIR /app

# 빌드 단계에서 생성된 필수 파일 복사
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json .
# 빌드 결과물 (dist 폴더) 복사
COPY --from=builder /app/dist ./dist 

# 컨테이너의 내부 포트
EXPOSE 8080

# 컨테이너 실행 명령 (docker-compose.yml의 command가 최종적으로 덮어씁니다.)
CMD [ "npm", "run", "start:prod" ]