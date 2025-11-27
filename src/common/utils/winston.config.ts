import { utilities, WinstonModule } from 'nest-winston'
import { join } from 'path'
import * as winston from 'winston'
import winstonDaily from 'winston-daily-rotate-file'
import { safeStringify } from './utils'

const env = process.env.NODE_ENV
const logDir = join(__dirname, '..', '..', '..', 'logs')

// 동적 로그 레벨 설정 (환경 변수로 제어 가능)
const logLevel = process.env.LOG_LEVEL || (env === 'production' ? 'info' : 'debug')

// 파일 로그용 포맷 (서버 로그와 동일한 포맷: 시간 + 레벨 + 컨텍스트 + 메시지)
const fileLogFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, context, stack }) => {
    const contextStr = context ? `[${String(safeStringify(context))}]` : '[SiksaBack]'
    const baseLog = `${String(timestamp)} [${String(level).toUpperCase()}] ${contextStr} ${String(message)}`
    return stack ? `${baseLog}\n${String(safeStringify(stack))}` : baseLog
  }),
)

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: join(logDir, level),
    filename: `%DATE%.${level}.log`,
    maxFiles: '30d',
    zippedArchive: true,
    format: fileLogFormat, // 파일에 포맷 적용
  }
}

// Winston logger 인스턴스 생성
const loggerInstance = WinstonModule.createLogger({
  level: logLevel, // 동적 로그 레벨 적용
  transports: [
    // Console transport (터미널 출력)
    new winston.transports.Console({
      format:
        env === 'production'
          ? winston.format.simple()
          : winston.format.combine(
              winston.format.timestamp(),
              utilities.format.nestLike('SiksaBack', {
                prettyPrint: true,
                colors: true,
              }),
            ),
    }),
    // 모든 레벨 로그 (silly 포함, 터미널 로그 전부 저장)
    new winstonDaily({
      ...dailyOptions('all'),
      level: 'silly', // 모든 로그 레벨 캡처
    }),
    // Info 이상
    new winstonDaily(dailyOptions('info')),
    // Error만
    new winstonDaily(dailyOptions('error')),
  ],
})

export const winstonLogger = loggerInstance

// 런타임에 로그 레벨 변경 함수
export function setLogLevel(level: string) {
  ;(loggerInstance as unknown as { level: string }).level = level
  console.warn(`Log level changed to: ${level}`)
}
