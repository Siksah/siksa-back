import { IsNotEmpty, IsOptional, IsString, IsNumber, ValidateNested, Min, Max, IsBoolean } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { ThinkingLevel } from '@google/genai'
export class GenerateConfigDto {
  @IsOptional()
  @IsNumber()
  @Min(-1)
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      const num = parseInt(value, 10)
      return isNaN(num) ? value : num
    }
    return value
  })
  thinkingBudget?: number

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.toUpperCase() === 'LOW' ? ThinkingLevel.LOW : ThinkingLevel.HIGH
    } else {
      throw new Error('thinkingLevel is just "low" or "high"')
    }
  })
  thinkingLevel?: ThinkingLevel

  @IsOptional()
  @IsNumber()
  @Min(0.0)
  @Max(2.0)
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      const num = parseFloat(value)
      return isNaN(num) ? value : num
    }
    return value
  })
  temperature?: number
}

export class GenerateTextDto {
  @IsString()
  @IsNotEmpty()
  prompt!: string

  @IsString()
  model: string = 'gemini-2.5-flash'

  @ValidateNested()
  @Type(() => GenerateConfigDto)
  config?: GenerateConfigDto

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true'
    }
    return value
  })
  isAdmin?: boolean
}
