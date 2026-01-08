import { IsNotEmpty, IsString, IsOptional, IsISO8601 } from 'class-validator';

/**
 * 프론트엔드에서 POST /answerUser로 전송되는 데이터 구조 (DTO)
 */
export class AnswerDto {
    @IsOptional()
    @IsString()
    sessionId?: string;

    @IsOptional()
    @IsString()
    'party-size'?: string;

    @IsOptional()
    @IsString()
    taste?: string;

    @IsOptional()
    @IsString()
    texture?: string;

    @IsOptional()
    @IsString()
    temperature?: string;

    @IsOptional()
    @IsString()
    avoid?: string;

    @IsOptional()
    @IsString()
    aftermeal?: string;

    @IsOptional()
    @IsString()
    Result_Type?: string;

    @IsNotEmpty()
    @IsISO8601()
    timestamp!: string; 
}