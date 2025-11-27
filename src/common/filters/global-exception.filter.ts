import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import { safeStringify } from '../utils/utils'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    let message: string | object = '서버에서 응답한 오류입니다. 문의 바랍니다.'

    if (exception instanceof HttpException) {
      message = exception.getResponse()
    } else if (exception instanceof Error) {
      message = exception.message
    }

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        typeof message === 'object' && message !== null && 'message' in message
          ? (message as { message: unknown }).message
          : message,
    }

    this.logger.error(`Exception: ${safeStringify(responseBody)}`, exception instanceof Error ? exception.stack : '')

    response.status(status).json(responseBody)
  }
}
