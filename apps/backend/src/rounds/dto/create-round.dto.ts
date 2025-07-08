import { Difficulty } from '@prisma/client';
import { ArrayMinSize, IsArray, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateRoundDto {
  @IsNumber()
  gameId: number;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  areas: string[];
}
