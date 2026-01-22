import { IsNotEmpty, IsString, IsOptional, IsISO8601, IsIn, IsObject } from 'class-validator';

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsString()
  sessionId!: string;

  @IsNotEmpty()
  @IsString()
  retryCount!: string;

  @IsOptional() // 기기 정보는 누락될 수도 있으므로 Optional 처리
  @IsObject()
  device?: any;

  @IsNotEmpty()
  @IsObject()
  result!: any;

  @IsNotEmpty()
  @IsIn(['like', 'dislike']) // 지정된 값만 허용
  feedback!: 'like' | 'dislike';
  
  @IsNotEmpty()
  @IsISO8601()
  timestamp!: string;
}