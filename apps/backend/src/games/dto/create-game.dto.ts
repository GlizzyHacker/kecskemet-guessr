import { Difficulty } from '@prisma/client';
import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateGameDto {
  @IsNumber()
  @IsInt()
  @IsPositive()
  totalRounds: number;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  areas: string[];

  @IsBoolean()
  hint: boolean;

  @IsNumber()
  @IsInt()
  timer: number;
}
