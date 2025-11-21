import { IsNotEmpty, IsString, IsOptional, IsISO8601 } from 'class-validator';

/**
 * 프론트엔드에서 POST /answerUser로 전송되는 데이터 구조 (DTO)
 */
export class AnswerDto {
    @IsOptional()
    Q1: any; 

    @IsOptional()
    Q2: any;

    @IsOptional()
    Q3: any;

    @IsOptional()
    Q4: any;

    @IsOptional()
    Q5: any;

    @IsOptional()
    Q6: any;

    @IsOptional()
    @IsString()
    Result_Type?: string; // 결과 페이지 타입 (선택 사항)

    // @IsNotEmpty()
    // @IsString()
    // userId: string; // 익명 또는 실제 사용자 ID

    @IsNotEmpty()
    @IsISO8601() // ISO 8601 형식인지 검사 (YYYY-MM-DDTHH:mm:ss.sssZ)
    timestamp!: string; 
}