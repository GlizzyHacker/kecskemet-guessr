import { Area, Difficulty } from '@prisma/client';
import { IsEnum, IsNumber, IsPositive } from 'class-validator';

export class CreateGameDto {
  @IsNumber()
  @IsPositive()
  totalRounds: number;

  @IsNumber()
  @IsPositive()
  guesses: number;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsEnum(Area)
  area: Area;
}
