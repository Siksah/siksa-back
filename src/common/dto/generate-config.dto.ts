import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class GenerateConfigDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      // value가 null, undefined, 또는 파싱할 수 없는 문자열일 경우를 대비
      return parseInt(String(value), 10);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  })
  thinkingBudget: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0.0)
  @Max(2.0)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      // value가 null, undefined, 또는 파싱할 수 없는 문자열일 경우를 대비
      return parseFloat(String(value));
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  })
  temperature: number = 1.0;
}
