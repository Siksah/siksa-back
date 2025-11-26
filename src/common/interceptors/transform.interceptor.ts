import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Request, Response as ExpressResponse } from 'express'

export interface Response<T> {
  statusCode: number
  timestamp: string
  path: string
  data: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<ExpressResponse>()

    return next.handle().pipe(
      map(data => ({
        statusCode: response.statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        data,
      })),
    )
  }
}
