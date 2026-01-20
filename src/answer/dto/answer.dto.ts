import { IsNotEmpty, IsString, IsOptional, IsISO8601 } from 'class-validator';

/**
 * 프론트엔드에서 POST /answerUser로 전송되는 데이터 구조 (DTO)
 */
export class AnswerDto {
    @IsOptional()
    @IsString()
    sessionId?: string;

    @IsOptional()
    answers?: any;

    @IsNotEmpty()
    @IsISO8601()
    timestamp!: string; 
}