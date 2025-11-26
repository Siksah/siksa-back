import { utilities, WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import winstonDaily from 'winston-daily-rotate-file'

const env = process.env.NODE_ENV
const logDir = __dirname + '/../../../logs' // logs directory relative to this file

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: '30d', // keep logs for 30 days
    zippedArchive: true, // gzip archived log files
  }
}

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: env === 'production' ? 'http' : 'silly',
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
    // info, warn, error logs
    new winstonDaily(dailyOptions('info')),
    // only error logs
    new winstonDaily(dailyOptions('error')),
  ],
})
