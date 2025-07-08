import { Difficulty } from '@prisma/client';
import { ArrayMinSize, IsArray, IsEnum, IsString } from 'class-validator';

export class CreateImageDto {
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  areas: string[];
}
