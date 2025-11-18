import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { GenerateConfigDto } from './generate-config.dto';
import { Type } from 'class-transformer';

export class GenerateTextDto {
  @IsString()
  @IsNotEmpty()
  prompt!: string;

  @ValidateNested()
  @Type(() => GenerateConfigDto)
  config: GenerateConfigDto = new GenerateConfigDto();
}
